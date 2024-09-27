
export enum MetaKey{
    index = 'index',
    login = 'login',
    spot = 'spot',
}

export type GetStaticProps = {
    key: MetaKey;
    auth: boolean;
    env: any;
    robots: boolean;
}