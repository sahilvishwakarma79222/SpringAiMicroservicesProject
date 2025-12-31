package exception;

import java.util.Scanner;


class Test1{
	
	public void calc() throws ArithmeticException{
		System.out.println("connectin established");
		Scanner sc=new Scanner(System.in);
		System.out.println("enter numerator for division");
		int n=sc.nextInt();
		System.out.println("enter denomenator for division");
		int d=sc.nextInt();
		int res=n/d;
		System.out.println("res is "+res);
	}
}


public class Launch1 {

	public static void main(String args[]) {
		
		Test1 t1=new Test1();
		try {
			t1.calc();

		}catch (ArithmeticException e) {
			System.out.println("excceptin occured");
			throw e;
		}
	}
}
