class Account{
  private String accountNumber;
  private double balance;

  public Account(String accNumber,double amount){
    accountNumber=accNumber;
    balance=amount;
  }
  public double getbalance(){
    return balance;
  }
  public void setBalance(double amount){
    if(amount>=0){
      balance=amount;
    }
  }
  public void deposit(double amount){
    if(amount>0){
      balance+=amount;
    }
  }
  public void withdraw(double amount){
    if(amount>0&&balance-amount>=0){
      balance-=amount;
      System.out.println("Balance withdrawn successfully");
    }
    else System.out.println("Not sufficient balance");
  }
}

public class BankAccount{
  public static void main(String[] args){
    Account b=new Account("78451239",1250);
    b.deposit(180.0);
    b.withdraw(280.4);
    b.withdraw(950.54);
    System.out.println(b.getBalance());
  }
}
