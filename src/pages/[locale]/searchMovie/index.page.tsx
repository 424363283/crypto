
import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { Movie } from '@/core/shared';
import { useEffect , useState} from 'react';
// import PcHome from '@/components/movie/pcHome';
import styles from "./styles.module.scss";

const NoviceTask: React.FC<object> = () => {
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState([]);
  const [langList, setLangList] = useState([]);
  const [plateList, setPlateList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [resourceList, setResourceList] = useState([]);
  const [serialList, setSerialList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [page, setPage] = useState(1);

  const [lang, setLang]= useState("");
  const [plate, setPlate] = useState("");
  const [region, setRegion] = useState("");
  const [resource, setResource] = useState("");
  const [serial, setSerial] = useState("");
  const [year, setYear] = useState("");

  
  useEffect(() => {
    init(page)
  }, []);

  const updateMovie = (num) => {
    setPage(num)
    // console.log(num)
    init(num)
  }

  const init = (pageNumber: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    void Movie.getSearchCondition().then((res: unknown) => {
      setLangList(res['lang'])
      setPlateList(res['plate'])
      setRegionList(res['region'])
      setResourceList(res['resource'])
      setSerialList(res['serial'])
      setYearList(res['year'])
      });
  }

  const toSearch = () => {
    var params = {
      "lang": lang,
      "year": year,
      "region": region,
      "resource": resource,
      "rows": 20
    }
    void Movie.getMovieList(params).then((res: unknown) => {
      if(res != undefined){
        setMovies(res['list'])
      }
      });
  }


  return (
    <UniversalLayout bgColor='transparent' hideFooter={true}>
      <div className='container'>
        <div className={styles.searchRow}>
          <div className={styles.item}>
            <div className={styles.left}>语言</div>
            <div className={styles.right}>
              {
                langList && langList.map((item, index) => (
                  <span key={index} className={lang === item['title']?styles.spActive :styles.sp} 
                  onClick={() => setLang(item['title'])} >{item['title']}</span>
                ))
              }
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.left}>类型</div>
            <div className={styles.right}>
              {
                plateList && plateList.map((item, index) => (
                  <span key={index} className={plate === item['title']?styles.spActive :styles.sp}
                  onClick={() => setPlate(item['title']) }
                  >{item['title']}</span>
                ))
              }
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.left}>产地</div>
            <div className={styles.right}>
              {
                regionList && regionList.map((item, index) => (
                  <span key={index} className={region === item['title']?styles.spActive :styles.sp} 
                  onClick={() => setRegion(item['title'])} >{item['title']}</span>
                ))
              }
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.left}>片源</div>
            <div className={styles.right}>
              {
                resourceList && resourceList.map((item, index) => (
                  <span key={index} className={resource === item['title']?styles.spActive :styles.sp} 
                  onClick={() => setResource(item['title'])} >{item['title']}</span>
                ))
              }
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.left}>类型</div>
            <div className={styles.right}>
              {
                serialList && serialList.map((item, index) => (
                  <span key={index} className={serial === item['title']?styles.spActive :styles.sp} 
                  onClick={() => setSerial(item['title'])} >{item['title']}</span>
                ))
              }
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.left}>年分</div>
            <div className={styles.right}>
              {
                yearList && yearList.map((item, index) => (
                  
                  <span key={index} className={year === item['title']?styles.spActive :styles.sp} 
                  onClick={() => setYear(item['title'])} >{item['title']}</span>
                ))
              }
            </div>
          </div>
        </div>
        <div className={styles.page}>
          <div className={styles.searchBtn} onClick={() =>toSearch()}>搜索</div>
        </div>
        <div className={styles.row}>
        {
          movies.map((item, index) => (
            <div className={styles.item} key={index}>
              <div className={styles.left}>
                <img src={item['imgPath']} className={styles.webp}/>
              </div>
              <div className={styles.right}>
                <div>{item['title']}</div> 
                <a href={`/zh/play?id=${item['id']}&title=${item['title']}`} className={styles.play}>播放</a>
                <div>{item['id']}</div> 
                <div>{item['cidMapper']}</div>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{
                      __html: item['contxt'],
                    }}
                  ></div>
              </div>
            </div>
          ))
        }
        </div>
      </div>
      <div className={styles.space}></div>
      <div className={styles.movieFooter}>
        <a href="/zh/home" className={styles.item}>发现</a>
        <a href="/zh/searchMovie" className={styles.itemActive}>搜索</a>
        <div className={styles.item}>收藏</div>
        <div className={styles.item}>我的</div>
      </div>
      <style jsx>{`
        .container {
          min-height: calc(100vh - 56px);
          background: var(--theme-background-color-3-2);
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(NoviceTask);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'novice-task', auth: false });
