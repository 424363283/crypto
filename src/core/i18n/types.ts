
export enum MetaKey{
    index = 'index',
    login = 'login'
}

export type GetStaticProps = {
    key: MetaKey;
    auth: boolean;
    env: any;
    robots: boolean;
}