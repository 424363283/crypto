import CommonIcon from "@/components/common-icon";
import BasicModal from "@/components/modal/basic-modal";
import { Svg } from "@/components/svg";
import { LANG } from "@/core/i18n";
import { RootColor } from "@/core/styles/src/theme/global/root";
import Image from 'next/image';
import { useEffect, useState } from "react";
import css from "styled-jsx/css";

interface FavorColorSettingProps { 
    isOpen: boolean;
    close: Function;
}

const items = [
    {
        text: LANG('绿涨红跌'),
        icon: 'common-green-up-red-down-0',
    },
    {
        text: LANG('红涨绿跌'),
        icon: 'common-red-up-green-down',
    },
    {
        text: LANG('红涨蓝跌'),
        icon: 'common-red-up-blue-down',
    },
    {
        text: LANG('色觉障碍'),
        icon: 'common-cvd',
    },
];
const colorUpList = ['color-green', 'color-red', 'color-red', 'color-cvd'];

const upColor = (index:number) => {
    return colorUpList[index];
}
const colorDownList = ['color-red', 'color-green', 'color-blue', 'color-blue',];
const downColor = (index: number) => { 
    return colorDownList[index];
}

const FavorColorSetting = (props: FavorColorSettingProps) => {
    const [value, setValue] = useState(1);
    const { isOpen, close} = props;
    
    useEffect(() => {
        const index = RootColor.getColorIndex;
        setValue(index);
    }, []);

    //选择颜色
    const changeColor = async (index: number) => { 
        setValue(index+1);
    }

    //设置颜色
    const setColor = () => {
        RootColor.setColorRGB(value);
        close();
    }

    return (
        <>
            <BasicModal
                open={isOpen}
                title={LANG('颜色偏好设置')}
                width={400}
                onCancel={()=> close()}
                onOk={() => setColor()}
                className='favor-color-modal'
                okText={LANG('确定')}
                hasCancel={false}
                // cancelText={LANG('取消')}
                destroyOnClose
            >
                <ul className="config-wrapper">
                    {items.map((item, index) => (
                        <li className={`items ${value == index+1?'active':''}`} key={index} onClick={()=>{
                            changeColor(index);
                        }}>
                            <div className="title">
                                <div className="item-text">
                                    <CommonIcon name={item.icon} size={16} />
                                    <div>{item.text}</div>
                                </div>
                                <div className="item-select">
                                    {
                                        value == index + 1 ?
                                            <Svg src={'/static/icons/primary/common/color-select.svg'}  color="var(--brand)" /> : <Svg src={ '/static/icons/primary/common/color-unselect.svg'}/>
                                    }
                                </div>
                            </div>
                            <div className="color-case">
                                <div className="case-item">
                                    <Image src={"/static/images/common/case.png"} alt={""} width={100} height={16} />
                                    <span className={`case-text ${upColor(index)}`}>+6.26</span>
                                </div>
                                <div className="case-item">
                                    <Image src={"/static/images/common/case.png"} alt={""} width={100} height={16} />
                                    <span className={`case-text ${downColor(index)}`}>-1.32</span>
                                </div>
                            </div>
                        </li>
                    ))}
               </ul>
        </BasicModal>
        <style jsx>{favorColorStyle}</style>
    </>
    )
}

const favorColorStyle = css`
    :global(.favor-color-modal .ant-modal-content .basic-content ) {
        .config-wrapper{
            padding: 0;
            margin:0;
            .items{
                border: 1px solid var(--line-1);
                border-radius: 8px;
                padding: 10px 15px;
                margin-bottom: 10px;
                &.active{
                    border-color: var(--brand);
                }
                &:last-child{
                    margin-bottom: 0;
                }
                .title{
                    display: flex;
                    justify-content: space-between;
                    .item-text{
                        display: flex;
                         align-items: center;
                        justify-content: center;
                        div{
                            margin-left: 10px;
                        }
                    }
                }
                .color-case{
                    margin-top: 10px;
                    .case-item{
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        &:last-child{
                            margin-bottom: 0;
                        }
                        .case-text{
                            font-size: 13px;
                            font-weight: 500;
                            &.color-red{
                                color: var(--color-red);
                            }
                            &.color-green{
                                color: var(--color-green);
                            }
                             &.color-blue{
                                color: #1E8DF9;
                            }
                            &.color-cvd{
                                color: #EC8E41;
                            }
                        }
                    }
                }
            }
        }
    }
`

export default FavorColorSetting;