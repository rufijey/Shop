import {usePaginate} from "../../../hooks/usePaginate";
import cl from "./Pagination.module.css"
const Pagination = ({totalPages, page, changePage}) => {
    let pagesArray = usePaginate(totalPages);
    return (
        <div className={cl.page__wrapper}>
            {pagesArray.map(p =>
                <span
                    onClick={() => changePage(p)}
                    key={p}
                    className={page === p ? [cl.page, cl.page__current].join(' ') : cl.page}
                >
                        {p}
                    </span>
            )}
        </div>
    );
};

export default Pagination;