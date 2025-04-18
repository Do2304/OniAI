class User {
  late int id;
  late String name;
  late String name1;
  User(this.id, this.name);
  

  @override
  String toString() {
    // TODO: implement toString
    return '$id - $name';
  }
}
