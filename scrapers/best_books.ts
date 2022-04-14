import axios from "axios";
import cheerio from "cheerio";
import mysql from 'mysql'

export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'everyday',
  database: 'book_titles'
})



const scrapeBestBooks = async () => {
  try{
    connection.connect()
    const ray: string[] = []
    const response = await axios.get("https://www.goodreads.com/list/show/43.Best_Young_Adult_Books")
    const $ = cheerio.load(response.data);
    $("div#all_votes > table > tbody > tr").each((i, el) => {
      const tmp: string = $(el).find('a.bookTitle').text().trim()
      let temp: string = ""
      let contained: boolean = false
      for(let i = 0; i < tmp.length; i++){
        if(tmp[i] === "("){
          contained = true
          break;
        }
        temp += tmp[i]
      }
      if(contained)
        temp = temp.substring(0,temp.length-1);
        connection.query('select BookTitle from books where BookTitle = ?', [temp], (e, r, f) => {
        if(r.length === 0){
          connection.query('insert into books (BookTitle) values (?)', [temp]);
          console.log("added");
        }
      })
    })

  }catch(e){
    console.log(e)
  }
}

scrapeBestBooks();