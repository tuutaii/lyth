import 'package:equatable/equatable.dart';
import 'package:lyth_astrology/data/services/astrology_api_service.dart';

abstract class BirthInfoState extends Equatable {
  const BirthInfoState();

  @override
  List<Object?> get props => [];
}

class BirthInfoInitial extends BirthInfoState {}

class BirthInfoLocationLoading extends BirthInfoState {}

class BirthInfoLocationSuccess extends BirthInfoState {
  final GeoLocation location;
  final String statusMessage;

  const BirthInfoLocationSuccess(this.location, this.statusMessage);

  @override
  List<Object?> get props => [location, statusMessage];
}

class BirthInfoLocationFailure extends BirthInfoState {
  final GeoLocation fallbackLocation;
  final String errorMessage;

  const BirthInfoLocationFailure(this.fallbackLocation, this.errorMessage);

  @override
  List<Object?> get props => [fallbackLocation, errorMessage];
}

class BirthInfoSubmitLoading extends BirthInfoState {
  final GeoLocation? resolvedLocation;
  final String? locationStatus;

  const BirthInfoSubmitLoading({this.resolvedLocation, this.locationStatus});

  @override
  List<Object?> get props => [resolvedLocation, locationStatus];
}

class BirthInfoSubmitSuccess extends BirthInfoState {}

class BirthInfoSubmitFailure extends BirthInfoState {
  final String errorMessage;
  final GeoLocation? resolvedLocation;
  final String? locationStatus;

  const BirthInfoSubmitFailure(this.errorMessage,
      {this.resolvedLocation, this.locationStatus});

  @override
  List<Object?> get props => [errorMessage, resolvedLocation, locationStatus];
}
