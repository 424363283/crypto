import { useEffect, useState } from 'react';

export const useMiniChartData = () => {
  const [miniChartData, setMiniChartData] = useState<{ [key: string]: [] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [symbols, setSymbols] = useState<string[]>(['']);

  useEffect(() => {
    setIsLoading(true);
    const nowTime = Date.parse(new Date().toString()) / 1000;
    const oldTime = 1800;
    const params = { resolution: 1, from: nowTime - oldTime, to: nowTime };
    const TV_LINK = `/api/tv/tradingView/history?symbols=${symbols}&from=${params.from}&to=${params.to}&resolution=${params.resolution}`;
    if (symbols.length < 2) return;
    fetch(TV_LINK)
      .then((response) => response.json())
      .then(({ s, data }) => {
        if (s === 'ok') {
          setMiniChartData(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [JSON.stringify(symbols)]);

  return { miniChartData, setSymbols: (s: string[]) => setSymbols(s), isLoading };
};
