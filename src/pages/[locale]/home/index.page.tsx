import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { Movie } from '@/core/shared';
import { useEffect , useState} from 'react';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperNormal from "@/components/home/swiperNormal/SwiperNormal";
// import PcHome from '@/components/movie/pcHome';
import styles from "./styles.module.scss";
import React from 'react';

SwiperCore.use([Autoplay]);

const NoviceTask: React.FC<object> = () => {
  const [list, setList] = useState([]);
  const [hot, setHot] = useState([]);
  const [banner, setBanner] = useState([]);
  const [drama, setDrama] = useState([]);
  const [show, setShow] = useState([]);
  const [movie, setMovie] = useState([]);
  const [anime, setAnime] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    init(page)
  }, []);

  const updateMovie = (num) => {
    setPage(num)
    init(num)
  }

  const init = (pageNumber: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // void Movie.getMovieList({page:pageNumber, rows: 20 }).then((res: unknown) => {
    //   if(res != undefined){
    //     setList(res['list'])
    //   }
    //   });

    void Movie.getHomeType().then((res: unknown) => {
      if(res != undefined){
        setTabs(res)
      }
    });

    void Movie.getHomeList().then((res: unknown) => {
      if(res != undefined){
        //banner 
        var banner_data = res.filter(x => x.type === "banner")
        setBanner(banner_data[0]['list'])
        //今日热点
        var h_data = res.filter(x => x.type === "hot")
        setHot(h_data[0]['list'])
        //电视剧 
        var d_data = res.filter(x => x.type === "drama")
        setDrama(d_data[0]['list'])  
        //电影 
        var m_data = res.filter(x => x.type === "movie")
        setMovie(m_data[0]['list'])
        //综艺 
        var s_data = res.filter(x => x.type === "show")
        setShow(s_data[0]['list'])
        //综艺 
        var s_data = res.filter(x => x.type === "anime")
        setAnime(s_data[0]['list'])
        
        setList(res)
      }
    });
  }


  return (
    <UniversalLayout bgColor='transparent' hideFooter={true}>
      <div className='container'>
        <div className={styles.banner}>
          <Swiper
              direction={'vertical'}
              className='notice_swiper'
              autoplay={{
                delay: 2000,
              }}
              loop={true}
            >
            {banner.map((o, index) => (
                <SwiperSlide key={index}>
                  <img src={o['imgPath']} className={styles.swiperImg} />
                </SwiperSlide>
              ))}
            </Swiper>
        </div>
        <div className={styles.tabs}>
          {
            tabs.map((item, index) => (
              <div key={index} className={styles.tvTab}>{item['name']}</div>
            ))
          }
        </div>
        <div className={styles.row}>
        <div className={styles.box}>
          <div className={styles.title}>今日热点</div>
          <div className={styles.hotArea}>
            {
              hot.map((o, index) => (
                <div className={styles.hotItem} key={index}>
                  <div className={styles.webp}><img src={o['imgPath']} className={styles.webp}/></div>
                  <div className={styles.title}>{o['title']}</div> 
                </div>
              ))
            }
          </div>
          <div className={styles.title}>电影</div>
          <div className={styles.hotArea}>
            {
              movie.map((o, index) => (
                <div className={styles.hotItem} key={index}>
                  <div className={styles.webp}><img src={o['imgPath']} className={styles.webp}/></div>
                  <div className={styles.title}>{o['title']}</div> 
                </div>
              ))
            }
          </div>

          <div className={styles.title}>电视剧</div>
          <div className={styles.hotArea}>
            {
              drama.map((o, index) => (
                <div className={styles.hotItem} key={index}>
                  <div className={styles.webp}><img src={o['imgPath']} className={styles.webp}/></div>
                  <div className={styles.title}>{o['title']}</div> 
                </div>
              ))
            }
          </div>

          <div className={styles.title}>综艺</div>
          <div className={styles.hotArea}>
            {
              show.map((o, index) => (
                <div className={styles.hotItem} key={index}>
                  <div className={styles.webp}><img src={o['imgPath']} className={styles.webp}/></div>
                  <div className={styles.title}>{o['title']}</div> 
                </div>
              ))
            }
          </div>

          <div className={styles.title}>动漫</div>
          <div className={styles.hotArea}>
            {
              anime.map((o, index) => (
                <div className={styles.hotItem} key={index}>
                  <div className={styles.webp}><img src={o['imgPath']} className={styles.webp}/></div>
                  <div className={styles.title}>{o['title']}</div> 
                </div>
              ))
            }
          </div>
        </div>
        {/* {list.length >0 && list.map((item, index) => {
          return (
            <div className={styles.box} key={index}>
               <div className={styles.title}>{item['title']}</div>
               <div  className={styles.body}>
                {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                   item['list'].map((o, i) => {
                    console.log(o[''])
                    return (
                    <div key={i} className={styles.item}>
                      <div className={styles.left}>
                        <img src={o['imgPath']} className={styles.webp}/>
                      </div>
                      <div className={styles.right}>
                        <div>{o['title']}</div> 
                        <a href={`/zh/play?id=${o['id']}&title=${o['title']}`} className={styles.play}>播放</a>
                        <div>{o['id']}</div> 
                        <div>{o['cidMapper']}</div>
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{
                              __html: o['contxt'],
                            }}
                          ></div>
                      </div>
                    </div>
                  )})
                }
               </div>
            </div>
          );
        })} */}

        </div>
        <div className={styles.page}>
          {page !== 1 ? 
          <div className={styles.last} onClick={() => updateMovie(page-1)}>上一页</div>: ""}
          <div className={styles.next}  onClick={() => updateMovie(page+1)}>下一页</div>
        </div>
      </div>
      <div className={styles.space}></div>
      <div className={styles.movieFooter}>
        <a href="/zh/home" className={styles.itemActive}>发现</a>
        <a href="/zh/searchMovie" className={styles.item}>搜索</a>
        <div className={styles.item}>收藏</div>
        <div className={styles.item}>我的</div>
      </div>

      <style jsx>{`
        .container {
          min-height: calc(100vh - 56px);
          background: var(--theme-background-color-3-2);
        }
        .swiper{
           height: 100% !important;
        }
        .notice_swiper{
          height: 100% !important  
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(NoviceTask);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'novice-task', auth: false });
