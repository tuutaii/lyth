import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class DateSelector extends StatelessWidget {
  final DateTime selectedDate;
  final Function(DateTime) onDateSelected;
  final UserModel? userData;

  const DateSelector({
    super.key,
    required this.selectedDate,
    required this.onDateSelected,
    this.userData,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final List<DateTime> displayDates =
        List.generate(5, (i) => now.add(Duration(days: i - 1)));
    final weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(selectedDate.day == now.day ? 'HÔM NAY' : 'DỰ BÁO',
                style: GoogleFonts.montserrat(
                    color: AppColors.goldDeep,
                    letterSpacing: 2.0,
                    fontSize: 9,
                    fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            Row(
              children: displayDates.map((d) {
                final isSelected = d.day == selectedDate.day;
                return GestureDetector(
                  onTap: () => onDateSelected(d),
                  child: Padding(
                    padding: const EdgeInsets.only(right: 20),
                    child: Column(
                      children: [
                        Text(
                          weekDays[d.weekday % 7],
                          style: GoogleFonts.montserrat(
                            fontSize: 8,
                            color: isSelected
                                ? AppColors.textPrimary
                                : AppColors.textMuted,
                            letterSpacing: 0.5,
                            fontWeight:
                                isSelected ? FontWeight.w600 : FontWeight.w400,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text('${d.day}',
                            style: GoogleFonts.lora(
                                fontSize: 16,
                                color: isSelected
                                    ? AppColors.textPrimary
                                    : AppColors.textMuted,
                                fontWeight: isSelected
                                    ? FontWeight.w700
                                    : FontWeight.w400)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
        _buildAvatar(userData),
      ],
    );
  }

  Widget _buildAvatar(UserModel? user) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        image: user?.photoUrl != null
            ? DecorationImage(
                image: NetworkImage(user!.photoUrl!), fit: BoxFit.cover)
            : null,
        border: Border.all(color: AppColors.goldAccent.withValues(alpha: 0.3)),
      ),
      child: user?.photoUrl == null
          ? const Icon(Icons.person_outline,
              color: AppColors.goldAccent, size: 20)
          : null,
    );
  }
}
