abstract class bank{
  private static int balance =7500;
  public void getBalance(){
    System.out.println(balance);
  }
  public void setBalance(int val){
    balance=val;
  }
  public int getCurrentBalance(){
    return balance;
  }
}
class Sbi extends bank{
  public void credit(int val){
    int current=getCurrentBalance();
    current+=val;
    setBalance(current);
  }
  public void debit(int val){
    int current=getCurrentBalance();
    current-=val;
    setBalance(current);
  }
}
    
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
