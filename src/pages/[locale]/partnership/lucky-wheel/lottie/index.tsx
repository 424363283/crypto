import dynamic from 'next/dynamic';

const BoxPopAnime = dynamic(import('./box-pop'), { ssr: false });
const BoxUpAnime = dynamic(import('./box-up-anime'), { ssr: false });
const CoinWeb = dynamic(import('./coin-web'), { ssr: false });
const OpenBoxAnime = dynamic(import('./open-box-anime'), { ssr: false });
const WheelAnime = dynamic(import('./wheel-anime'), { ssr: false });

export { BoxPopAnime, BoxUpAnime, CoinWeb, OpenBoxAnime, WheelAnime };
