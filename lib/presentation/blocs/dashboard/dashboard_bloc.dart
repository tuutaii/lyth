import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import 'dashboard_event.dart';
import 'dashboard_state.dart';

import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/daily_message.dart';
import 'package:lyth_astrology/data/services/firestore_service.dart';
import 'package:lyth_astrology/data/services/astrology_api_service.dart';
import 'package:lyth_astrology/data/services/astro_data_mapper.dart';
import 'package:lyth_astrology/data/services/gemini_service.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final FirestoreService _firestoreService = FirestoreService();
  final AstrologyApiService _apiService = AstrologyApiService();
  final GeminiService _geminiService = GeminiService();

  final Map<String, UserAstroProfile> _profileCache = {};

  DashboardBloc() : super(DashboardInitial()) {
    on<DashboardInitRequested>(_onInitRequested);
    on<DashboardDateChanged>(_onDateChanged);
    on<DashboardTabChanged>(_onTabChanged);
    on<DashboardRefreshRequested>(_onRefreshRequested);
  }

  Future<void> _onInitRequested(DashboardInitRequested event, Emitter<DashboardState> emit) async {
    final dateKey = state.selectedDate.toString().split(' ')[0];
    
    emit(DashboardLoading(
      currentIndex: state.currentIndex,
      selectedDate: state.selectedDate,
      currentUser: event.user,
    ));

    await _fetchData(event.user, state.selectedDate, dateKey, emit);
  }

  Future<void> _onDateChanged(DashboardDateChanged event, Emitter<DashboardState> emit) async {
    if (state.currentUser == null) return;
    
    final dateKey = event.date.toString().split(' ')[0];
    
    emit(DashboardLoading(
      currentIndex: state.currentIndex,
      selectedDate: event.date,
      currentUser: state.currentUser,
    ));

    if (_profileCache.containsKey(dateKey)) {
      emit(DashboardLoaded(
        currentIndex: state.currentIndex,
        selectedDate: event.date,
        currentUser: state.currentUser,
        profile: _profileCache[dateKey]!,
      ));
      return;
    }

    await _fetchData(state.currentUser!, event.date, dateKey, emit);
  }

  Future<void> _onRefreshRequested(DashboardRefreshRequested event, Emitter<DashboardState> emit) async {
    if (state.currentUser == null) return;

    final dateKey = state.selectedDate.toString().split(' ')[0];
    
    // Clear cache for current date to force re-fetch
    _profileCache.remove(dateKey);

    emit(DashboardLoading(
      currentIndex: state.currentIndex,
      selectedDate: state.selectedDate,
      currentUser: state.currentUser,
    ));

    await _fetchData(state.currentUser!, state.selectedDate, dateKey, emit);
  }

  void _onTabChanged(DashboardTabChanged event, Emitter<DashboardState> emit) {
    if (state is DashboardLoaded) {
      final currentState = state as DashboardLoaded;
      emit(DashboardLoaded(
        currentIndex: event.index,
        selectedDate: currentState.selectedDate,
        currentUser: currentState.currentUser,
        profile: currentState.profile,
      ));
    } else if (state is DashboardLoading) {
      emit(DashboardLoading(
        currentIndex: event.index,
        selectedDate: state.selectedDate,
        currentUser: state.currentUser,
      ));
    } else {
       emit(DashboardInitial());
    }
  }

  Future<void> _fetchData(currentUser, DateTime date, String dateKey, Emitter<DashboardState> emit) async {
    try {
      DailyMessage? firebaseMessage;
      Map<String, dynamic>? cachedAiData;

      firebaseMessage = await _firestoreService.getDailyMessage(dateKey);
      if (firebaseMessage == null) {
        cachedAiData = await _firestoreService.getUserDailyInsight(currentUser.uid, dateKey);
      }

      UserAstroProfile profile;

      if (firebaseMessage == null && cachedAiData != null) {
        profile = AstroDataMapper.mapNASADataToProfile(
            user: currentUser, planetLongitudes: {}, firebaseMessage: null);
        profile.dailyInsightHeader = cachedAiData['header'] ?? '';
        profile.dailyInsightBody = cachedAiData['body'] ?? '';
        profile.dailyInsightCategory = (cachedAiData['category'] ?? "IDENTITY").toString().toUpperCase();
        if (cachedAiData['dos'] != null) profile.adviceDos = List<String>.from(cachedAiData['dos']);
        if (cachedAiData['donts'] != null) profile.adviceDonts = List<String>.from(cachedAiData['donts']);
      } else {
        final lat = currentUser.latitude ?? 21.0285;
        final lng = currentUser.longitude ?? 105.8542;
        Map<String, double> planetData = {};

        if (firebaseMessage == null) {
          final planetIds = {
            'Sun': '10', 'Moon': '301', 'Mercury': '199', 
            'Venus': '299', 'Mars': '499', 'Jupiter': '599', 'Saturn': '699'
          };

          final results = await Future.wait(planetIds.entries.map((e) =>
              _apiService.getEclipticLongitude(
                  planetId: e.value, lat: lat, lng: lng, date: date)));

          int i = 0;
          for (var key in planetIds.keys) {
            planetData[key] = results[i++] ?? 0.0;
          }

          final aiData = await _geminiService.generateDailyInsightJSON(user: currentUser, planets: planetData);
          if (aiData != null) {
            await FirebaseFirestore.instance
                .collection('users').doc(currentUser.uid)
                .collection('daily_insights').doc(dateKey)
                .set({
              'header': aiData['header'],
              'body': aiData['body'],
              'category': aiData['category'],
              'dos': aiData['dos'],
              'donts': aiData['donts'],
              'is_ai_generated': true,
              'created_at': FieldValue.serverTimestamp(),
            }, SetOptions(merge: true));

            firebaseMessage = DailyMessage(
              dateKey: dateKey,
              header: aiData['header'] ?? '',
              body: aiData['body'] ?? '',
              dos: List<String>.from(aiData['dos'] ?? []),
              donts: List<String>.from(aiData['donts'] ?? []),
              category: aiData['category'] ?? 'General',
            );
          }
        }

        profile = AstroDataMapper.mapNASADataToProfile(
            user: currentUser,
            planetLongitudes: planetData,
            firebaseMessage: firebaseMessage);
      }

      _profileCache[dateKey] = profile;
      
      emit(DashboardLoaded(
        currentIndex: state.currentIndex,
        selectedDate: date,
        currentUser: currentUser,
        profile: profile,
      ));
    } catch (e) {
      debugPrint('⚠️ Bloc load error: $e');
      emit(DashboardError(
        currentIndex: state.currentIndex,
        selectedDate: date,
        currentUser: currentUser,
        message: e.toString()
      ));
    }
  }
}
