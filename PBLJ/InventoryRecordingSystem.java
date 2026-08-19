import java.util.*;
class StockManagementSystem{
  public static void main(String[] args){
    ArrayList<ArrayList<Integer>> stockdata=new ArrayList<>();
    stockdata.add(new ArrayList<>());
    stockdata.get(0).add(7);
    stockdata.get(0).add(12);
    stockdata.get(0).add(2);
    stockdata.add(new ArrayList<>());
    stockdata.get(1).add(11);
    stockdata.get(1).add(4);
    stockdata.get(1).add(18);
    stockdata.add(new ArrayList<>());
    stockdata.get(2).add(3);
    stockdata.get(2).add(25);
    stockdata.get(2).add(6);
    LinkedList<Integer> restockItems=new LinkedList<>();
    for(ArrayList<Integer> group:stockdata){
      for(Integer quantity:group){
        if(quantity<5){
          restockItems.add(quantity*2);
        }
      }
    }
    for(ArrayList<Integer>group:stockdata){
      System.out.println(group);
    }
    System.out.println(restockItems);
  }
}
