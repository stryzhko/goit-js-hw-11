import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_URL = '33581671-7d6695e1fa0aa9e5b0a79d79d';


export async function getFetchImage(searchText, page) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}?key=${KEY_URL}&q=${searchText}&page=${page}&per_page=100&image_type=photo&orientation=horizontal&safesearch=true`
    );

    // console.log(responce);
    return data;
  } catch (error) {
    console.log(error);
  }
}