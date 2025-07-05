import BasicModal from "@/components/modal/basic-modal";
import { LANG } from "@/core/i18n/src/page-lang";
import { TIME_ZON } from "@/core/shared/src/constants/time-zone";
import { WS } from '@/core/network';
import { useEffect, useState } from "react";
import css from "styled-jsx/css";
import { Svg } from "@/components/svg";
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { MobileBottomSheet } from "@/components/mobile-modal";


interface TimeZoneProps { 
    isOpen: boolean;
    close: () => void;
}
const TimeZone = (props: TimeZoneProps) => {
    const { isOpen, close } = props;
    const [selectedTime, setSelectedTime] = useState<{ label: string; value: string }[]>([
        { label: 'UTC-8', value: '16' },
    ]);
    const [timeZoneVal, setTimeZoneVal] = useState([{ label: '', value: '' }]);

    useEffect(() => {
        const formatTimeZone = TIME_ZON.map((item) => {
            return {
                value: item.value,
                label: item.title,
            };
        });
            
        setTimeZoneVal([{ 'value': '24', 'label': LANG('近24小时') }, ...formatTimeZone]);
            
        if (WS.timeOffset == '24') {
            setSelectedTime([
                { label: LANG('近24小时'), value: '24' },
            ]);
        } else {
            setSelectedTime([
                { label: TIME_ZON.find((item) => item.value === String(WS.timeOffset))?.title || '', value: WS.timeOffset },
            ]);
        }
    }, []);
    
    //切换时间段
    const changeTimeZone = (item: {
        label: string;
        value: string;
    }[]) => {
        setSelectedTime(item);//
    }

    //设置时间
    const setTimeZone = () => {
        WS.setTimeOffset(selectedTime[0].value);
        close();
    }

    // 内容
    const main = () => {
        return <>
            <ul className="config-wrapper">
                {
                    timeZoneVal.map((item, index) =>
                        <li className={`items ${item.value == selectedTime[0].value?'active':''}`} key={index} onClick={() => {
                            changeTimeZone([item]);
                        }}>
                            <div>{item.label}</div>
                            <div className="item-select">
                                {item.value == selectedTime[0].value ?
                                        <Svg src={'/static/icons/primary/common/color-select.svg'}  color="var(--brand)" /> : <Svg src={ '/static/icons/primary/common/color-unselect.svg'}/>
                                    }
                                
                            </div>
                        </li>
                    )
                }
            </ul>
            <style jsx>{timeZoneStyle}</style>
        </>
    }
    
    return (
        <>
        <Desktop>
            <BasicModal
                open={isOpen}
                title={LANG('UTC时区')}
                width={400}
                onCancel={close}
                onOk={setTimeZone}
                className='time-zone-modal'
                okText={LANG('确定')}
                hasCancel = {false}
                destroyOnClose
            >
                { main() }
            </BasicModal>
        </Desktop>
        <MobileOrTablet>
            <MobileBottomSheet
                title={LANG('UTC时区')}
                content={main()}
                visible={isOpen}
                close={close}
                onConfirm={setTimeZone}
            />
        </MobileOrTablet>    
    </>
    )
}

const timeZoneStyle = css`
    .config-wrapper{
        padding: 0;
        margin:0;
        height: 425px;
        overflow-y: auto;
        .items{
            border: 1px solid var(--fill_line_3);
            border-radius: 8px;
            padding: 10px 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            color: var(--text_1);;
            align-items: center;
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
        }
    }
`

export default TimeZone;
