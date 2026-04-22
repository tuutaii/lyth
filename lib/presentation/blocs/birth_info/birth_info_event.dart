import 'package:equatable/equatable.dart';

abstract class BirthInfoEvent extends Equatable {
  const BirthInfoEvent();

  @override
  List<Object?> get props => [];
}

class ResolveCityRequested extends BirthInfoEvent {
  final String city;

  const ResolveCityRequested(this.city);

  @override
  List<Object?> get props => [city];
}

class SubmitBirthInfoRequested extends BirthInfoEvent {
  final String uid;
  final int year;
  final int month;
  final int day;
  final int hour;
  final int minute;
  final String city;
  final double latitude;
  final double longitude;
  final double timezone;

  const SubmitBirthInfoRequested({
    required this.uid,
    required this.year,
    required this.month,
    required this.day,
    required this.hour,
    required this.minute,
    required this.city,
    required this.latitude,
    required this.longitude,
    required this.timezone,
  });

  @override
  List<Object?> get props => [
        uid, year, month, day, hour, minute, city, latitude, longitude, timezone
      ];
}
