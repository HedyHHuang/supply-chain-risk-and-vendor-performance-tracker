import { useEffect, useState } from "react";
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
    <main>
      <p>Logged in as {currentUser.name}</p>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      <Navbar onPageChange={setCurrentPage} />

      {currentPage === "orders" && (
        <>
          <OrderForm
            editingOrder={editingOrder}
            onAddOrder={handleAddOrder}
            onUpdateOrder={handleUpdateOrder}
            onCancelEdit={handleCancelEdit}
          />

          <OrderFilters
            filters={filters}
            onFilterChange={setFilters}
          />

          <OrderList
            orders={filteredOrders}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        </>
      )}

      {currentPage === "scorecards" && (
        <>
          <VendorScorecardForm
            editingScorecard={editingScorecard}
            onAddScorecard={handleAddScorecard}
            onUpdateScorecard={handleUpdateScorecard}
            onCancelEdit={handleCancelScorecardEdit}
          />

          <VendorScorecardList
            scorecards={scorecards}
            onEditScorecard={handleEditScorecard}
            onDeleteScorecard={handleDeleteScorecard}
          />
        </>
      )}
    </main>
  );
}

export default App;