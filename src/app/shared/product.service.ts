import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = "https://localhost:44394/api/Product/";

  constructor(private http: HttpClient) {
  }

  postProduct(data: any) {
    return this.http.post<any>(this.url, data)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  getProduct() {
    return this.http.get<any>(this.url)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  deleteProduct(id: number) {
    return this.http.delete(this.url + id)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  updateProduct(data: any, id: number) {
    return this.http.put(this.url + id, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
