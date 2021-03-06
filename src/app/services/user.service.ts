import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

export interface User {
  id: number;
  name: string;
  userName: string;
  password: string;
  email: string;
  profilePic?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  users: User[] = [
    {
      id: 1,
      name: "harry",
      userName: "boy-who-lived",
      password: "lilyJames",
      email: "harry@hogwarts.com",
    },
  ];
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }
  registerUser(user: User) {
    this.users.push(user);
    this.http.post('http://localhost:3000/register',user).subscribe((msg)=>{
      console.log(msg);
      this.router.navigate(['/login']);
    })
    // return true;
  }
  getUsers(): User[] {
    return this.users;
  }
  login(username: string, password: string): boolean {
    var index = this.users.findIndex((u) => u.userName === username);
    // console.log("index", index);
    let user = {
      username:username,
      password:password
    }
    this.http.post('http://localhost:3000/login',user).subscribe((msg)=>{
      console.log(msg);
      this.router.navigate(['/login']);
    })
    if (index >= 0) {
      if (this.users[index].password === password) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(["/posts"]);
      } else return false;
    }
    return false;
  }
  recover(email: string) {
    var index = this.users.findIndex((u) => u.email === email);
    return index >= 0 ? true : false;
  }
  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
  }
  constructor(private router: Router,private http: HttpClient) {}
}
