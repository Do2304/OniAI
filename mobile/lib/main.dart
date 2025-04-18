import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: Colors.blue,
            title: Text("Tự học Flutter"),
          ),
          body: Center(child: Text("Hello anh Tánh123451")),
        ),
      ),
      debugShowCheckedModeBanner: false,
    ),
  );
}
