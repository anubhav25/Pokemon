import React, { Component } from "react";
import Pagination from "../Pagination/Pagination";
import Table from "../Table/Table";
import Modal from "../Modal/Modal";
import styles from "./Main.module.scss";
import loadingImg from "../../assets/loading.gif";
const baseUrl = "";
// function to debounce the search query
let timeout;
function debounce(query, data, changeFilteredData, time) {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    timeout = null;
    let temp = data;
    if (query) {
      try {
        const url = baseUrl + `/search/${query}`;
        let res = await (await fetch(url)).json();
        console.log(res);
        if (res.data) {
          changeFilteredData(res.data);
        }
      } catch {
        changeFilteredData([]);
      }
    } else {
      changeFilteredData(temp);
    }
  }, time);
}
//function to get the data using fetch api
async function getData(p, size) {
  try {
    let page = "" + p;
    const url = baseUrl + `/data?page=${page}&page_size=${+size || 10}`;
    let res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
}
//function to delete the data acc to id using fetch api
async function deletePokemon(id) {
  try {
    const url = baseUrl + `/pokemon/${id}`;
    let res = await fetch(url, {
      method: "DELETE"
    });
    return await res.json();
  } catch {
    return null;
  }
}
//function to update the data acc to id using fetch api
async function updatePokemon(id, data) {
  try {
    const url = baseUrl + `/pokemon/${id}`;
    let res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return null;
  }
}
//function to create new data using fetch api
async function addPokemon(data) {
  try {
    const url = baseUrl + `/pokemon`;
    let res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return null;
  }
}
class Main extends Component {
  //initial state
  state = {
    loading: false,
    itemsperpage: 0,
    totalItems: 0,
    data: [],
    filtereddata: [],
    query: "",
    modalData: null
  };
  //helper functions
  closeModal = () => this.setState({ modalData: null });
  changeFilteredData = filtereddata => this.setState({ filtereddata });
  updatequery = e => {
    let q = e.target.value;
    this.setState({ query: q });
    // debounce the search query to 500 milisecs in case user wants to enter more data
    debounce(q, this.state.data, this.changeFilteredData, 500);
  };
  // redirect to diffrent page
  updatePage = p => {
    this.setState({ query: "" });
    let { history } = this.props;
    history && history.push("/" + p);
  };
  // open modal when clicked on row
  onItemClick = modalData => {
    this.setState({ modalData });
  };
  // open empty modal when clecked on New
  onNewClick = () => {
    this.setState({
      modalData: {
        isNew: true,
        name: { english: "" },
        type: [],
        base: {
          Attack: "",
          Defense: ""
        }
      }
    });
  };

  componentDidUpdate(prevprops) {
    let page = this.props.page;
    // fetch new data only if the new page number is different from old page no
    if (prevprops.page !== page) {
      this.updateData(page);
    }
  }

  componentDidMount() {
    // fetch data when page is loaded
    this.updateData(this.props.page);
  }
  // update data acc to page no
  updateData = page => {
    this.setState({
      loading: true,
      itemsperpage: 0,
      totalItems: 0,
      data: [],
      filtereddata: [],
      query: "",
      modalData: null
    });
    getData(page, this.props.cache).then(res => {
      if (res) {
        let { page_size, total_items, data } = res;
        // update recieved data
        this.setState({
          itemsperpage: page_size,
          totalItems: total_items,
          data: data,
          filtereddata: data,
          loading: false
        });
      } else {
        this.setState({
          itemsperpage: 0,
          totalItems: 0,
          data: [],
          filtereddata: [],
          loading: false
        });
      }
    });
  };
  render() {
    let page = this.props?.page;
    let {
      loading,
      modalData,
      filtereddata,
      query,
      totalItems,
      itemsperpage
    } = this.state;
    if (loading) {
      // fallback when the data is being loaded
      return (
        <div className={styles.fallback}>
          <img src={loadingImg} alt="Loading" />
        </div>
      );
    }
    return (
      <div className={styles.container}>
        {/* load modal only when data is available  */}
        {modalData && (
          <Modal
            data={modalData}
            handleClose={this.closeModal}
            deletePokemon={deletePokemon}
            updatePokemon={updatePokemon}
            updateData={() => this.updateData(page)}
            addPokemon={addPokemon}
          ></Modal>
        )}
        {/* input to take search query  */}

        <input
          className={styles.search}
          value={query}
          onChange={this.updatequery}
          placeholder="Search"
          list="data"
        />
        {/* list to shoe autocomplete suggestions for search query  */}
        <datalist id="data">
          {query &&
            filtereddata.map(x => <option key={x.id} value={x.name.english} />)}
        </datalist>
        <Table
          data={filtereddata}
          onItemClick={this.onItemClick}
          onNewClick={this.onNewClick}
        ></Table>
        {/* pagination */}
        {!query && (
          <Pagination
            totalItems={totalItems}
            itemsperpage={itemsperpage}
            currentPage={page}
            onPageChange={this.updatePage}
          ></Pagination>
        )}
      </div>
    );
  }
}

export default Main;
