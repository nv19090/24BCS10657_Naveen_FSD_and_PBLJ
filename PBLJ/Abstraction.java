abstract class bank{
  private static int balance =7500;
  public void getBalance(){
    System.out.println(balance);
  }
  public void setbalance(int val){
    balance=val;
  }
  public int getCurrentBalance(){
    return balance;
  }
  public void credit(int val){
    balance+=val;
  }
  public void debit(int val){
    balance-=val;
  }
}
class Sbi extends bank{}

public class Abstration{
  public static void main(String[]args){
    Sbi sbi=new Sbi();
    sbi.getBalance();
    sbi.credit(1500);
    sbi.getBalance();
    sbi.debit(4000);
    sbi.getBalance();
  }
}
