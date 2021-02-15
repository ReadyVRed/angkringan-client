import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { environment } from 'src/environments/environment';

const Config = environment.supabase;
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(Config.Host, Config.ClientKey);
  }
  get<T>(resource: string, select = "*", match = null, order = null, limit = null) {
    const query = this.supabase.from(resource).select(select);
    if (match !== null) {
      query.match(match);
    }
    if (order !== null) {
      query.order(order, { ascending: true });
    }
    if (limit !== null) {
      query.limit(limit);
    }
    return from(query).pipe(
      map(res => res.data as T[])
    );
  }
  insert(resource: string, value) {
    const query = this.supabase.from(resource).insert([value]);
    return from(query).pipe(
      map(res => res)
    );
  }
  update(resource: string, value, match) {
    const query = this.supabase.from(resource).update(value).match(match);
    return from(query).pipe(
      map(res => res)
    );
  }
  delete(resource: string, match) {
    const query = this.supabase.from(resource).delete().match(match);
    return from(query).pipe(
      map(res => res)
    );
  }
}
