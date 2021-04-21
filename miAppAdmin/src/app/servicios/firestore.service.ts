import { Usuario } from './../Models/interfaces';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { isNull } from 'util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  user: Usuario;

  constructor(public FireStore: AngularFirestore,
              public FireAuth: AngularFireAuth) { }

  login(email: string, password: string){
    return this.FireAuth.signInWithEmailAndPassword(email, password);
     
   }     
   
   createUser(email:string, password: string){
     return this.FireAuth.createUserWithEmailAndPassword(email, password);
   }
 
   logout(){
     this.FireAuth.signOut();
   }
 
   getUidState(){
     return this.FireAuth.authState;
   }
 
   async getUid(){
     const user = await this.FireAuth.currentUser;
     if (!isNull(user)){
       return user.uid;
     }
     return '';
   }
 
   createDocument<tipo>(data: tipo, enlace: string, id: string){
     const collecion = this.FireStore.collection<tipo>(enlace);
     return collecion.doc(id).set(data);
   }
 
   getDoc<tipo>(path: string, id: string){
     const collection = this.FireStore.collection<tipo>(path);
     return collection.doc(id).valueChanges();
   }
 
   deleteDocument<tipo>(enlace: string, id: string){
     const collecion = this.FireStore.collection<tipo>(enlace);
     return collecion.doc(id).delete();
   }
   
   updateDoc(data: any, path: string, id: string){
     const colleccion = this.FireStore.collection(path);
     return colleccion.doc(id).update(data);
   }

   
 
   createID(){
     return this.FireStore.createId();
   }
  
  
   ngOnInit() {}
 
   getCollectionChanges<tipo>(enlace: string): Observable<tipo[]>{
   const ref = this.FireStore.collection<tipo>(enlace);
   return ref.valueChanges(); 
   }
 
   setUser(users: Usuario){
     this.user = users;
   }
 
   getUser(){
     return this.user;
   }
 
   getCollectionQuery<tipo>(path: string, parametro:string, condicion: any, busqueda: string){

       const collection = this.FireStore.collection<tipo>(path,
         ref => ref.where(parametro, condicion, busqueda)
                    
         );
       return collection.valueChanges(); 
       }
 
       getCollectionQueryVendedor<tipo>(path: string, parametro:string, condicion: any, busqueda: string, starAt: any ){
         if(starAt === null){
           starAt = new Date;
         }
         const collection = this.FireStore.collection<tipo>(path,
           ref => ref.where(parametro, condicion, busqueda)
                      .orderBy('FechaCreacion','desc')
                     .limit(5)
                     .startAfter(starAt)
           );
         return collection.valueChanges(); 
         }

}
