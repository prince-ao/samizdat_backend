import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";

export interface scrapedData {
  id: string
  title: string;
  author: string;
  publisher: string;
  year: string;
  language: string;
  format: string;
  size: string;
  pages: string;
  link: string;
}

const domain = "http://libgen"
const websites = [`${domain}.rs/`, `${domain}.is/`, `${domain}.st/`]

const getPage: () => Promise<any> = async () => {
  let i = 0
  do{
    const response = await axios.get(`${websites[i]}search.php?mode=last`)
    if(response.status < 400) return response.data
    if(i === 3){
      return "No Data"
    }
    i++
  }while(1);
}

const getAuthors = ($: CheerioAPI) => "a"

const getRecent = async () => {
  const data = await getPage();
  const $ = cheerio.load(data)
  const recent: [scrapedData] = [{
    id: "",
    title: "",
    author: "",
    publisher: "",
    year: "",
    language: "",
    format: "",
    size: "",
    pages: "",
    link: ""
  }]
  $('table.c > tbody > tr').each((i, el) => {
    const container: scrapedData = {
      id: "",
      title: "",
      author: "",
      publisher: "",
      year: "",
      language: "",
      format: "",
      size: "",
      pages: "",
      link: ""
    }
    $(el.children).each((i, el) => {
      if($(el).text() === "\n\t\t\t\t"){
        // if we can calculate the i's in which new line tab accurs we can do simple arithmatics to avoid problems.
        // the i's indeed do apear at the same area, switch case with simple arithmatics can be implmented.
        console.log(i)
        return
      }
      if(container.id === ""){
        container.id = $(el).text();
      }else if(container.author === ""){
        container.author = $(el).text();
      }else if(container.title === ""){
        container.title = $(el).text();
      }else if(container.year === ""){
        container.year = $(el).text();
      }else if(container.publisher === ""){
        container.publisher = $(el).text();
      }else if(container.pages === ""){
        container.pages = $(el).text();
      }else if(container.language === ""){
        container.language = $(el).text();
      }else if(container.size === ""){
        container.size = $(el).text();
      }else if(container.format === ""){
        container.format = $(el).text();
      }else{
        return
      }
      /*switch(i){
        case 0:
          container.id = $(el).text();
          break;
        case 1:
          container.author = $(el).text();
          break;
        case 2:
          container.title = $(el).text();
          break;
        case 3:
          container.publisher = $(el).text();
          break;
        case 4:
          container.year = $(el).text();
          break;
        case 5:
          container.pages = $(el).text();
          break;
        case 6:
          container.language = $(el).text();
          break;
        case 7:
          container.size = $(el).text();
          break;
        case 8:
          container.format = $(el).text();
          break;
      }*/
    })
    recent[i] = container
  })
  return recent
}

export default getRecent