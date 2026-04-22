import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lyth_astrology/data/services/astrology_api_service.dart';
import 'package:lyth_astrology/data/services/firestore_service.dart';

import 'birth_info_event.dart';
import 'birth_info_state.dart';

class BirthInfoBloc extends Bloc<BirthInfoEvent, BirthInfoState> {
  final AstrologyApiService _apiService = AstrologyApiService();
  final FirestoreService _firestoreService = FirestoreService();

  GeoLocation? _currentResolvedLocation;
  String? _currentLocationStatus;

  BirthInfoBloc() : super(BirthInfoInitial()) {
    // Giá trị khởi tạo mặc định cho test
    _currentResolvedLocation = const GeoLocation(
      latitude: 10.28701,
      longitude: 105.6617,
      timezone: 7.0,
      cityName: 'Lai Vung',
    );
    _currentLocationStatus = '📍 10.2870, 105.6617 · GMT+7 (Lai Vung)';

    on<ResolveCityRequested>((event, emit) async {
      emit(BirthInfoLocationLoading());

      try {
        GeoLocation? foundLocation =
            await _apiService.getGeoLocation(event.city);

        if (foundLocation == null) {
          final parts = event.city.split(RegExp(r'[, ]+'));
          if (parts.length > 1) {
            final fallbackCity = parts.last;
            debugPrint('Thử tìm kiếm fallback với: $fallbackCity');
            foundLocation = await _apiService.getGeoLocation(fallbackCity);
          }
        }

        if (foundLocation != null) {
          _currentResolvedLocation = foundLocation;
          _currentLocationStatus =
              '📍 ${foundLocation.latitude.toStringAsFixed(4)}, ${foundLocation.longitude.toStringAsFixed(4)} · GMT+${foundLocation.timezone.toStringAsFixed(0)}';

          emit(BirthInfoLocationSuccess(
              _currentResolvedLocation!, _currentLocationStatus!));
        } else {
          throw Exception('Location not found');
        }
      } catch (_) {
        _currentResolvedLocation = const GeoLocation(
          latitude: 10.28701,
          longitude: 105.6617,
          timezone: 7.0,
          cityName: 'Lai Vung',
        );
        _currentLocationStatus =
            '📍 Không tìm thấy: Dùng tạm Lai Vung. Bạn có thể thử nhập tên Tỉnh (vd: Dong Thap)';

        emit(BirthInfoLocationFailure(
            _currentResolvedLocation!, _currentLocationStatus!));
      }
    });

    on<SubmitBirthInfoRequested>((event, emit) async {
      emit(BirthInfoSubmitLoading(
        resolvedLocation: _currentResolvedLocation,
        locationStatus: _currentLocationStatus,
      ));

      try {
        await _firestoreService.updateBirthInfo(
          uid: event.uid,
          year: event.year,
          month: event.month,
          day: event.day,
          hour: event.hour,
          minute: event.minute,
          city: event.city,
          latitude: event.latitude,
          longitude: event.longitude,
          timezone: event.timezone,
        );

        emit(BirthInfoSubmitSuccess());
      } catch (e) {
        emit(BirthInfoSubmitFailure(
          'Lỗi khi lưu thông tin: $e',
          resolvedLocation: _currentResolvedLocation,
          locationStatus: _currentLocationStatus,
        ));
      }
    });
  }
}
