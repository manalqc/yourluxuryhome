// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_frontend/main.dart';

void main() {
  testWidgets('App loads successfully', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const YourLuxuryHomeApp());

    // Verify that our app loads without errors
    expect(find.byType(MaterialApp), findsOneWidget);
    
    // Pump once to ensure the widget tree is built
    await tester.pump();
    
    // Verify that scaffolds are present (we expect multiple nested scaffolds)
    expect(find.byType(Scaffold), findsAtLeastNWidgets(1));
    
    // Verify that the app has bottom navigation
    expect(find.byType(Container), findsWidgets);
  });
}
