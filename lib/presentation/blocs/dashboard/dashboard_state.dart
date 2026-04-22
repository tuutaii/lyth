import 'package:equatable/equatable.dart';
import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/user_model.dart';

abstract class DashboardState extends Equatable {
  final int currentIndex;
  final DateTime selectedDate;
  final UserModel? currentUser;
  
  const DashboardState({
    required this.currentIndex,
    required this.selectedDate,
    this.currentUser,
  });

  @override
  List<Object?> get props => [currentIndex, selectedDate, currentUser];
}

class DashboardInitial extends DashboardState {
  DashboardInitial() : super(currentIndex: 0, selectedDate: DateTime.now());
}

class DashboardLoading extends DashboardState {
  const DashboardLoading({
    required super.currentIndex,
    required super.selectedDate,
    super.currentUser,
  });
}

class DashboardLoaded extends DashboardState {
  final UserAstroProfile profile;
  
  const DashboardLoaded({
    required super.currentIndex,
    required super.selectedDate,
    required super.currentUser,
    required this.profile,
  });

  @override
  List<Object?> get props => [currentIndex, selectedDate, currentUser, profile];
}

class DashboardError extends DashboardState {
  final String message;
  
  const DashboardError({
    required super.currentIndex,
    required super.selectedDate,
    required super.currentUser,
    required this.message,
  });

  @override
  List<Object?> get props => [currentIndex, selectedDate, currentUser, message];
}
