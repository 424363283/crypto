import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { Movie } from '@/core/shared';
import React, { useEffect, useRef, useState } from "react";
import { getUrlQueryParams } from '@/core/utils';
import Player from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css';
import styles from "./styles.module.scss"


const NoviceTask: React.FC<{}> = () => {
  const playerInstance = useRef<Player>({} as Player);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [id] = useState( getUrlQueryParams('id'));
  const [title] = useState( getUrlQueryParams('title'))
  const [name] = useState( getUrlQueryParams('name'))
  const [episode, setEpisode] = useState([])  
  const [info, setInfo] = useState([])  
  const [number, setNumber] = useState(0)  

  // useEffect(() => {
  //   void Movie.getPlayList(id).then((res: unknown) => {
  //     setEpisode(res)
  //   })
  //  }, [id]);

  useEffect(() => {
    let params = {
      vid: id,
    }
    if(name !=null){
      params['name'] = name
    }
    movieInfo()
    void Movie.playClarityList(params).then((res: unknown) => {
      const { clarity } = res;
      const ret = clarity.filter(x => x.playId !== null)
      
      if(ret.length>0){
       videoPlay(ret[0]['rtmp'])
      }
     });
   }, [id]);

   const videoPlay = (src: any) => {
    playerInstance.current = new Player({
      plugins: [HlsPlugin],
      id: "playVideo",
      autoplay: true,
      autoplayMuted: false,
      url: src,
      width: '100%',
      height: '100%',
      videoFillMode: "fillHeight",
      playsinline: true,
      ignores: ['playbackRate', 'replay', 'error'],
      cssFullscreen: false,
    })
   }
  

  const changeEpisode = (index:number, name: string) => {
    setNumber(index)
    let params = {
      vid: id,
      name: name
    }

    void Movie.playClarityList(params).then((res: unknown) => {
      const { clarity } = res;
      const ret = clarity.filter(x => x.playId !== null)
      
      if(ret.length>0){
       videoPlay(ret[0]['rtmp'])
      }
     });
  }

  const movieInfo = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    void Movie.getMovieList({title: title }).then((res: unknown) => {
      if(res['list'].length>0){
          setInfo(res['list'][0])
        }
      });
  }

  return (
    <UniversalLayout bgColor='transparent'  hideFooter={true}>
      <div className='container'>
        <div className="screen">
          <a href="/zh/movie" className={styles.title}>返回</a>
          <div className={styles.playerWrapper}>
            <div className={styles.videoBox}>
              <div className={styles.name}>{info['title']}</div>
              <div id="playVideo" className='reactPlayer'></div>
            </div>  
            <div className={styles.right}>
              <div className={styles.basic}>
                <span dangerouslySetInnerHTML={{
                  __html: info['contxt'],
                }}></span>
                <span className={styles.border}>
                语言: {info['lang']}
                </span>


                <span className={styles.border}>
                演员: {info['stars']}
                </span>
              </div>
              <div className={styles.row}>
                {
                  episode.map((item, index) => (
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    <div key={index} onClick={()=> changeEpisode(index, item['name'])}
                    className={number === index? styles.episodeActive: styles.episode}>
                      {item['name']}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
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
        
        .reactPlayer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;;
          height: 500px !important;
        }

        #playVideo{
          position: relative;
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(NoviceTask);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'novice-task', auth: false });
