
export enum MetaKey{
    index = 'index',
    login = 'login',
    swap = 'swap',
    spot = 'spot',
    lite = 'lite',
}

export type GetStaticProps = {
    key: MetaKey;
    auth: boolean;
    env: any;
    robots: boolean;
}
