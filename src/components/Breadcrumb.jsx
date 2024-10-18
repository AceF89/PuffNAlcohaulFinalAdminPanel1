/* eslint-disable react/prop-types */


const Breadcrumb = ({ items }) => {
  return (
    <div>
      <h2 className='userlist_heading'>{items[items.length - 1]}</h2>
      <nav aria-label="breadcrumb mr-2">
        <ol className="breadcrumb">
          {items?.map((item, index) => (
            <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`} aria-current={index === items.length - 1 ? 'page' : ''}>
              {item}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
