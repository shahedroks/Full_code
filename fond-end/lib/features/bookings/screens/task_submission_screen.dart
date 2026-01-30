import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/models/service_category.dart';
import 'package:renizo/features/bookings/data/task_submission_service_structure.dart';
import 'package:renizo/features/bookings/screens/seller_matching_screen.dart';
import 'package:renizo/features/home/widgets/service_categories.dart';

/// Task submission form – full conversion from React TaskSubmission.tsx.
/// Create Booking: service type, sub-section, add-ons, date, time, address, notes.
class TaskSubmissionScreen extends StatefulWidget {
  const TaskSubmissionScreen({
    super.key,
    required this.selectedTownId,
    this.onSubmit,
  });

  static const String routeName = '/task-submission';

  final String selectedTownId;
  /// Called with form data when user taps "Find Available Providers".
  final void Function(TaskSubmissionFormData data)? onSubmit;

  @override
  State<TaskSubmissionScreen> createState() => _TaskSubmissionScreenState();
}

class _DropdownOption {
  const _DropdownOption(this.value, this.label);
  final String value;
  final String label;
}

class TaskSubmissionFormData {
  TaskSubmissionFormData({
    required this.categoryId,
    required this.subSectionId,
    this.addOnId,
    required this.date,
    required this.time,
    required this.address,
    this.notes,
  });
  final String categoryId;
  final String subSectionId;
  final String? addOnId;
  final String date;
  final String time;
  final String address;
  final String? notes;
}

class _TaskSubmissionScreenState extends State<TaskSubmissionScreen> {
  final List<ServiceCategory> _categories = ServiceCategoriesWidget.mockCategories;
  final List<String> _timeOptions = [
    'Morning (8AM - 12PM)',
    'Noon (12PM - 3PM)',
    'Afternoon (3PM - 6PM)',
  ];

  String _categoryId = '';
  String _subSectionId = '';
  String _addOnId = '';
  String _date = '';
  String _time = '';
  String _address = '';
  String _notes = '';

  static const Color _bgBlue = Color(0xFF2384F4);
  static const Color _buttonBlue = Color(0xFF003E93);
  static const Color _focusBlue = Color(0xFF408AF1);
  /// Dropdown overlay – dark blue-grey with white text and checkmark for selected (matches design).
  static const Color _dropdownMenuBg = Color(0xFF2C3E50);

  TaskServiceStructure? get _serviceStructure =>
      _categoryId.isEmpty ? null : getTaskServiceStructure(_categoryId);

  bool get _isFormValid =>
      _categoryId.isNotEmpty &&
      _subSectionId.isNotEmpty &&
      _date.isNotEmpty &&
      _time.isNotEmpty &&
      _address.isNotEmpty;

  String _formatDisplayDate(String dateStr) {
    if (dateStr.isEmpty) return '';
    final parts = dateStr.split('-');
    if (parts.length != 3) return dateStr;
    final year = int.tryParse(parts[0]) ?? 0;
    final month = int.tryParse(parts[1]) ?? 1;
    final day = int.tryParse(parts[2]) ?? 1;
    final date = DateTime(year, month, day);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    final weekday = days[date.weekday % 7];
    return '$weekday, ${months[date.month - 1]} $day, $year';
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
    );
    if (picked != null && mounted) {
      setState(() {
        _date = '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
    }
  }

  void _submit() {
    if (!_isFormValid) return;
    final data = TaskSubmissionFormData(
      categoryId: _categoryId,
      subSectionId: _subSectionId,
      addOnId: _addOnId.isEmpty ? null : _addOnId,
      date: _date,
      time: _time,
      address: _address,
      notes: _notes.isEmpty ? null : _notes,
    );
    widget.onSubmit?.call(data);
    if (!mounted) return;
    final bookingId = 'booking_${DateTime.now().millisecondsSinceEpoch}';
    Navigator.of(context).push<void>(
      MaterialPageRoute<void>(
        builder: (context) => SellerMatchingScreen(
          categoryId: _categoryId,
          selectedTownId: widget.selectedTownId,
          bookingId: bookingId,
          onSelectProvider: (provider) {
            if (!context.mounted) return;
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Selected ${provider.displayName}')),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgBlue,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildServiceTypeDropdown(),
                    if (_categoryId.isNotEmpty && _serviceStructure != null) ...[
                      SizedBox(height: 24.h),
                      _buildSubSectionDropdown(),
                    ],
                    if (_serviceStructure != null && _subSectionId.isNotEmpty) ...[
                      SizedBox(height: 24.h),
                      _buildAddOnDropdown(),
                    ],
                    SizedBox(height: 24.h),
                    _buildDateField(),
                    SizedBox(height: 24.h),
                    _buildTimeDropdown(),
                    SizedBox(height: 24.h),
                    _buildAddressField(),
                    SizedBox(height: 24.h),
                    _buildNotesField(),
                    SizedBox(height: 24.h),
                  ],
                ),
              ),
            ),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.fromLTRB(16.w, 16.h, 16.w, 16.h),
      decoration: BoxDecoration(
        color: _bgBlue,
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextButton.icon(
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(Icons.chevron_left, size: 24.sp, color: Colors.white),
            label: Text('Back', style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500, color: Colors.white)),
          ),
          Text(
            'Create Booking',
            style: TextStyle(fontSize: 20.sp, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          SizedBox(height: 4.h),
          Text(
            'Tell us what you need help with',
            style: TextStyle(fontSize: 14.sp, color: Colors.white.withOpacity(0.8)),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String iconName, String text, {bool required = true, bool optional = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Row(
        children: [
          Icon(_iconFor(iconName), size: 20.sp, color: Colors.white),
          SizedBox(width: 8.w),
          Text(
            text,
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500, color: Colors.white),
          ),
          if (required) Text(' *', style: TextStyle(fontSize: 16.sp, color: Colors.red.shade300)),
          if (optional) Text(' (Optional)', style: TextStyle(fontSize: 14.sp, color: Colors.white70)),
        ],
      ),
    );
  }

  IconData _iconFor(String name) {
    switch (name) {
      case 'Sparkles': return Icons.auto_awesome;
      case 'Package': return Icons.inventory_2_outlined;
      case 'Plus': return Icons.add;
      case 'Calendar': return Icons.calendar_today;
      case 'Clock': return Icons.access_time;
      case 'MapPin': return Icons.location_on_outlined;
      case 'FileText': return Icons.description_outlined;
      default: return Icons.circle_outlined;
    }
  }

  Widget _buildServiceTypeDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Sparkles', 'Service Type'),
        _dropdown(
          value: _categoryId,
          hint: 'Select a service',
          options: _categories.map((c) => _DropdownOption(c.id, c.name)).toList(),
          onChanged: (v) {
            setState(() {
              _categoryId = v ?? '';
              _subSectionId = '';
              _addOnId = '';
            });
          },
        ),
      ],
    );
  }

  Widget _buildSubSectionDropdown() {
    final structure = _serviceStructure;
    if (structure == null) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Package', 'Service Sub-section'),
        _dropdown(
          value: _subSectionId,
          hint: 'Select sub-section',
          options: structure.subSections.map((s) {
            final price = s.basePrice != null ? ' - \$${s.basePrice!.toInt()}' : '';
            return _DropdownOption(s.id, '${s.name}$price');
          }).toList(),
          onChanged: (v) => setState(() => _subSectionId = v ?? ''),
        ),
      ],
    );
  }

  Widget _buildAddOnDropdown() {
    final structure = _serviceStructure;
    if (structure == null) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Plus', 'Add-Ons', required: false, optional: true),
        _dropdown(
          value: _addOnId,
          hint: 'No add-ons',
          allowEmptyValue: true,
          options: [
            const _DropdownOption('', 'No add-ons'),
            ...structure.addOns.map((a) => _DropdownOption(a.id, '${a.name} - +\$${a.price.toInt()}')),
          ],
          onChanged: (v) => setState(() => _addOnId = v ?? ''),
        ),
      ],
    );
  }

  Widget _buildDateField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Calendar', 'Preferred Date'),
        InkWell(
          onTap: _pickDate,
          borderRadius: BorderRadius.circular(16.r),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.r),
              border: Border.all(color: const Color(0xFFE5E7EB), width: 2),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _date.isEmpty ? 'Select a date' : _formatDisplayDate(_date),
                    style: TextStyle(
                      fontSize: 16.sp,
                      color: _date.isEmpty ? Colors.grey : Colors.black87,
                    ),
                  ),
                ),
                Icon(Icons.calendar_today, size: 20.sp, color: Colors.grey),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTimeDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Clock', 'Preferred Time'),
        _dropdown(
          value: _time,
          hint: 'Select a time',
          options: _timeOptions.map((t) => _DropdownOption(t, t)).toList(),
          onChanged: (v) => setState(() => _time = v ?? ''),
        ),
      ],
    );
  }

  Widget _buildAddressField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('MapPin', 'Service Address'),
        TextField(
          onChanged: (v) => setState(() => _address = v),
          decoration: InputDecoration(
            hintText: 'Enter your address',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 2)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 2)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: _focusBlue, width: 2)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
          ),
        ),
      ],
    );
  }

  Widget _buildNotesField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('FileText', 'Additional Notes', required: false, optional: true),
        TextField(
          onChanged: (v) => setState(() => _notes = v),
          maxLines: 4,
          decoration: InputDecoration(
            hintText: 'Describe the issue or any special requirements...',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 2)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 2)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16.r), borderSide: const BorderSide(color: _focusBlue, width: 2)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
          ),
        ),
      ],
    );
  }

  Widget _dropdown({
    required String value,
    required String hint,
    required List<_DropdownOption> options,
    required ValueChanged<String?> onChanged,
    bool allowEmptyValue = false,
  }) {
    final menuItems = options.map((opt) {
      final isSelected = opt.value == value;
      return DropdownMenuItem<String>(
        value: opt.value,
        child: Row(
          children: [
            Expanded(
              child: Text(
                opt.label,
                style: TextStyle(color: Colors.white, fontSize: 16.sp),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (isSelected) Icon(Icons.check, color: Colors.white, size: 22.sp),
          ],
        ),
      );
    }).toList();

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 2),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: (value.isEmpty && !allowEmptyValue) ? null : value,
          hint: Text(hint, style: TextStyle(color: Colors.grey.shade700, fontSize: 16.sp)),
          isExpanded: true,
          dropdownColor: _dropdownMenuBg,
          borderRadius: BorderRadius.circular(16.r),
          selectedItemBuilder: (context) => options.map((opt) => Align(
            alignment: Alignment.centerLeft,
            child: Text(
              opt.label,
              style: TextStyle(color: Colors.black, fontSize: 16.sp),
              overflow: TextOverflow.ellipsis,
            ),
          )).toList(),
          items: menuItems,
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      padding: EdgeInsets.fromLTRB(16.w, 16.h, 16.w, 16.h),
      decoration: BoxDecoration(
        color: _bgBlue,
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isFormValid ? _submit : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: _buttonBlue,
              foregroundColor: Colors.white,
              disabledBackgroundColor: _buttonBlue.withOpacity(0.5),
              padding: EdgeInsets.symmetric(vertical: 16.h),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.r)),
              elevation: 8,
              shadowColor: _buttonBlue.withOpacity(0.3),
            ),
            child: Text('Find Available Providers', style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500)),
          ),
        ),
      ),
    );
  }
}
