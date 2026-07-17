import { useEffect, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination/Pagination";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./services/authApi";

import AuthForm from "./components/AuthForm/AuthForm";

import { calculateRisk } from "./utils/calculateRisk";
import { calculateScorecard } from "./utils/calculateScorecard";

import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "./services/ordersApi";

import {
  createScorecard,
  deleteScorecard,
  getScorecards,
  updateScorecard,
} from "./services/scorecardsApi";

import Navbar from "./components/Navbar/Navbar";
import OrderForm from "./components/OrderForm/OrderForm";
import OrderFilters from "./components/OrderFilters/OrderFilters";
import OrderList from "./components/OrderList/OrderList";
import VendorScorecardForm from "./components/VendorScorecardForm/VendorScorecardForm";
import VendorScorecardList from "./components/VendorScorecardList/VendorScorecardList";
import ScorecardFilters from "./components/ScorecardFilters/ScorecardFilters";

function App() {
  const [currentPage, setCurrentPage] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const [scorecards, setScorecards] = useState([]);
  const [editingScorecard, setEditingScorecard] = useState(null);

  const [filters, setFilters] = useState({
    vendorName: "",
    riskLevel: "",
    status: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);

  const [scorecardPage, setScorecardPage] = useState(1);
  const [scorecardPageSize, setScorecardPageSize] = useState(10);
  const [scorecardFilters, setScorecardFilters] = useState({
    vendorName: "",
    performanceRating: "",
  });

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    async function loadData() {
      try {
        const [ordersData, scorecardsData] = await Promise.all([
          getOrders(),
          getScorecards(),
        ]);

        setOrders(ordersData);
        setScorecards(scorecardsData);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, [currentUser]);

  async function handleAddOrder(orderData) {
    try {
      const newOrder = {
        id: crypto.randomUUID(),
        ...orderData,
        riskLevel: calculateRisk(orderData),
      };

      const savedOrder = await createOrder(newOrder);

      setOrders((previousOrders) => [...previousOrders, savedOrder]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditOrder(order) {
    setEditingOrder(order);
  }

  async function handleUpdateOrder(orderData) {
    try {
      const updatedOrderData = {
        ...orderData,
        riskLevel: calculateRisk(orderData),
      };

      const savedOrder = await updateOrder(updatedOrderData);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === savedOrder.id ? savedOrder : order,
        ),
      );

      setEditingOrder(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteOrder(orderId) {
    try {
      await deleteOrder(orderId);

      setOrders((previousOrders) =>
        previousOrders.filter((order) => order.id !== orderId),
      );

      if (editingOrder?.id === orderId) {
        setEditingOrder(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancelEdit() {
    setEditingOrder(null);
  }

  async function handleAddScorecard(scorecardData) {
    try {
      const calculatedData = calculateScorecard(scorecardData);

      const newScorecard = {
        id: crypto.randomUUID(),
        ...scorecardData,
        ...calculatedData,
      };

      const savedScorecard = await createScorecard(newScorecard);

      setScorecards((previousScorecards) => [
        ...previousScorecards,
        savedScorecard,
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditScorecard(scorecard) {
    setEditingScorecard(scorecard);
  }

  async function handleUpdateScorecard(scorecardData) {
    try {
      const calculatedData = calculateScorecard(scorecardData);

      const updatedScorecardData = {
        ...scorecardData,
        ...calculatedData,
      };

      const savedScorecard = await updateScorecard(updatedScorecardData);

      setScorecards((previousScorecards) =>
        previousScorecards.map((scorecard) =>
          scorecard.id === savedScorecard.id
            ? savedScorecard
            : scorecard,
        ),
      );

      setEditingScorecard(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteScorecard(scorecardId) {
    try {
      await deleteScorecard(scorecardId);

      setScorecards((previousScorecards) =>
        previousScorecards.filter(
          (scorecard) => scorecard.id !== scorecardId,
        ),
      );

      if (editingScorecard?.id === scorecardId) {
        setEditingScorecard(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancelScorecardEdit() {
    setEditingScorecard(null);
  }

  const filteredOrders = orders.filter((order) => {
    const matchesVendor = order.vendorName
      .toLowerCase()
      .includes(filters.vendorName.toLowerCase());

    const matchesRisk =
      filters.riskLevel === "" ||
      order.riskLevel === filters.riskLevel;

    const matchesStatus =
      filters.status === "" || order.status === filters.status;

    return matchesVendor && matchesRisk && matchesStatus;
  });
  const filteredScorecards = scorecards.filter((scorecard) => {
    const matchesVendor = scorecard.vendorName
      .toLowerCase()
      .includes(scorecardFilters.vendorName.toLowerCase());

    const matchesRating =
      scorecardFilters.performanceRating === "" ||
      scorecard.performanceRating === scorecardFilters.performanceRating;

    return matchesVendor && matchesRating;
  });
  const orderStartIndex = (orderPage - 1) * orderPageSize;
  const paginatedOrders = filteredOrders.slice(
    orderStartIndex,
    orderStartIndex + orderPageSize,
  );

  const scorecardStartIndex =
    (scorecardPage - 1) * scorecardPageSize;

  const paginatedScorecards = filteredScorecards.slice(
    scorecardStartIndex,
    scorecardStartIndex + scorecardPageSize,
  );
  async function handleRegister(userData) {
    await registerUser(userData);

    const user = await loginUser({
      email: userData.email,
      password: userData.password,
    });

    setCurrentUser(user);
  }

  async function handleLogin(credentials) {
    const user = await loginUser(credentials);
    setCurrentUser(user);
  }

  async function handleLogout() {
    try {
      await logoutUser();
      setCurrentUser(null);
      setOrders([]);
      setScorecards([]);
    } catch (error) {
      console.error(error);
    }
  }

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="user-bar">
        <p>Logged in as {currentUser.name}</p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Navbar onPageChange={setCurrentPage} />

      <main className="page-content">
        {currentPage === "orders" && (
          <div className="orders-layout">
            <div className="left-panel">
              <OrderForm
                key={editingOrder?.id ?? "new-order"}
                editingOrder={editingOrder}
                onAddOrder={handleAddOrder}
                onUpdateOrder={handleUpdateOrder}
                onCancelEdit={handleCancelEdit}
              />

              <OrderFilters
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setOrderPage(1);
                }}
              />
            </div>

            <div className="right-panel">
              <OrderList
                orders={paginatedOrders}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
              />

              <Pagination
                currentPage={orderPage}
                pageSize={orderPageSize}
                totalItems={filteredOrders.length}
                onPageChange={setOrderPage}
                onPageSizeChange={(newPageSize) => {
                  setOrderPageSize(newPageSize);
                  setOrderPage(1);
                }}
              />
            </div>
          </div>
        )}

        {currentPage === "scorecards" && (
          <div className="scorecards-layout">
            <div className="left-panel">
              <VendorScorecardForm
                key={editingScorecard?.id ?? "new-scorecard"}
                editingScorecard={editingScorecard}
                onAddScorecard={handleAddScorecard}
                onUpdateScorecard={handleUpdateScorecard}
                onCancelEdit={handleCancelScorecardEdit}
              />
              <ScorecardFilters
                filters={scorecardFilters}
                onFilterChange={(newFilters) => {
                  setScorecardFilters(newFilters);
                  setScorecardPage(1);
                }}
              />
            </div>

            <div className="right-panel">
              <VendorScorecardList
                scorecards={paginatedScorecards}
                onEditScorecard={handleEditScorecard}
                onDeleteScorecard={handleDeleteScorecard}
              />

              <Pagination
                currentPage={scorecardPage}
                pageSize={scorecardPageSize}
                totalItems={filteredScorecards.length}
                onPageChange={setScorecardPage}
                onPageSizeChange={(newPageSize) => {
                  setScorecardPageSize(newPageSize);
                  setScorecardPage(1);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;