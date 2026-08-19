interface Drivable {
  void drive();
}

class Vehicle {
  String brand="BMW";
  String speed="180Kmph";
  public static void move(){
    System.out.println("Move");
  }
}

class Car extends Vehicle implements Drivable{
  Car(String name){
    System.out.println("This car of brand : " + name);
  }
  int seats=4;
  
  @Override
  public void drive(){
    System.out.println("This is drive implementation");
  }
  public static void display(){

    System.out.println("Displlay method");
  }
}

public class Interface{
  public static void main(String[] args){
    Car c=new Car("Mercedes");
    c.move();
    c.drive();
    c.display();
  }
}
