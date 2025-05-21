function SearchRequired() {
  return (
    <div className="join">
      <input
        type="text"
        name="search_string"
        className="join-item btn"
        placeholder="Tìm kiếm..."
      />
      <select name="typeSearch" className="join-item">
        <option value="product">Phần mềm</option>
        <option value="project" defaultChecked>
          Dự án
        </option>
      </select>
      <button className="btn">Tìm kiếm</button>
    </div>
  );
}

export default SearchRequired;
