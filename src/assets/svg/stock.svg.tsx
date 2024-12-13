interface Props {
    className?:string
}

const StockSvg = ({className}:Props) => {
    return (
        <svg className={`${className} size-4`} width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.740014 4.82904L9.30401 0.936035L17.868 4.82904M0.740014 4.82904L9.30301 8.72204M0.740014 4.82904V13.393L9.30401 18.064M17.868 4.82904L9.30401 8.72204V18.064M17.868 4.82904L17.869 13.393L9.30401 18.064M12.642 16.173V11.502M15.311 14.839V10.168" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>

    )
}

export default StockSvg
