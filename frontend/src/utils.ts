import { createResource } from "solid-js";
import { Book } from "./data/books";

export function localStorageCreateResource(key: string, url: string){
    return createResource<Book[]>(async () => {
    const data =  await (await fetch(url)).json()
    localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    return data
  }, { initialValue: JSON.parse(localStorage.getItem(key) || '[]') });
  }