import React, { useState } from 'react';
import { Container, Alert, Form, Button, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';  // Import Axios for API calls

const popularSymbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "SPY"];

function App() {
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [symbol, setSymbol] = useState("SPY");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleRunTradingBot = async () => {
      setLoading(true);
      setMessage(null);

      const simulationData = {
          symbol,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
      };

      try {
          // Send data to backend
          const response = await axios.post('http://localhost:8000/api/run-trade-bot/', simulationData);
          setMessage(response.data.message);
      } catch (error) {
          setMessage('Error: Could not store simulation data.');
      } finally {
          setLoading(false);
      }
  };

    return (
        <div className="container">
            <h1>SentixTrade: Your AI Stock Trading Assistant</h1>

            {message && (
                <Alert variant="info" className="alert">
                    {message}
                </Alert>
            )}

            <div className="alert-container">
                <Alert className="alert">
                    <strong>Sentiment Analysis Driven 🧐</strong><br />
                    SentixTrade dynamically adjusts trading strategy based on accurate sentiment analysis of financial news.
                </Alert>

                <Alert className="alert">
                    <strong>Disclaimer ⚠️</strong><br />
                    SentixTrade currently supports paper trading simulation and analysis, which does not include commission and fees.
                </Alert>
            </div>

            <Form>
                <Form.Group className="form-group input-icon">
                    <Form.Label>Select start date</Form.Label>
                    <div className="input-icon">
                        <DatePicker 
                            selected={startDate} 
                            onChange={date => setStartDate(date)} 
                            className="form-control rounded"
                            placeholderText="Select start date"
                        />
                        <FaCalendarAlt className="icon" />
                    </div>
                </Form.Group>

                <Form.Group className="form-group input-icon">
                    <Form.Label>Select end date</Form.Label>
                    <div className="input-icon">
                        <DatePicker 
                            selected={endDate} 
                            onChange={date => setEndDate(date)} 
                            className="form-control rounded"
                            placeholderText="Select end date"
                        />
                        <FaCalendarAlt className="icon" />
                    </div>
                </Form.Group>

                <Form.Group className="form-group input-icon">
                    <Form.Label>Select stock index</Form.Label>
                    <div className="input-icon">
                        <Form.Control 
                            as="select" 
                            value={symbol} 
                            onChange={e => setSymbol(e.target.value)} 
                            className="form-control rounded"
                        >
                            {popularSymbols.map(sym => (
                                <option key={sym} value={sym}>{sym}</option>
                            ))}
                        </Form.Control>
                        <FaChevronDown className="icon dropdown-icon" />
                    </div>
                </Form.Group>

                <Button 
                    variant="success" 
                    onClick={handleRunTradingBot}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            Running <Spinner animation="border" size="sm" className="spinner" />
                        </>
                    ) : "Run Trading Bot"}
                </Button>
            </Form>
        </div>
    );
}

export default App;
