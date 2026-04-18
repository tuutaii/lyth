/// App configuration constants
/// WARNING: In production, use environment variables or secure storage
class AppConfig {
  // Free Astrology API
  static const String astrologyApiBaseUrl = 'https://json.freeastrologyapi.com';
  static const String astrologyApiKey = 'HqXE11yqY956Ts5I4FK5P9gMcgg9y18P3jzxh8Xi';

  // Default location: Hà Nội, Việt Nam
  static const double defaultLatitude = 21.0285;
  static const double defaultLongitude = 105.8542;
  static const double defaultTimezone = 7.0;

  // API config
  static const String observationPoint = 'topocentric';
  static const String ayanamshaWestern = 'tropical';
  static const String ayanamshaVedic = 'lahiri';
  static const String language = 'en';
}
