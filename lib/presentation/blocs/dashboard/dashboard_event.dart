import 'package:equatable/equatable.dart';
import 'package:lyth_astrology/data/models/user_model.dart';

abstract class DashboardEvent extends Equatable {
  const DashboardEvent();

  @override
  List<Object?> get props => [];
}

class DashboardInitRequested extends DashboardEvent {
  final UserModel user;
  const DashboardInitRequested(this.user);
  
  @override
  List<Object?> get props => [user.uid];
}

class DashboardDateChanged extends DashboardEvent {
  final DateTime date;
  const DashboardDateChanged(this.date);

  @override
  List<Object?> get props => [date];
}

class DashboardTabChanged extends DashboardEvent {
  final int index;
  const DashboardTabChanged(this.index);

  @override
  List<Object?> get props => [index];
}
class DashboardRefreshRequested extends DashboardEvent {
  const DashboardRefreshRequested();

  @override
  List<Object?> get props => [];
}
