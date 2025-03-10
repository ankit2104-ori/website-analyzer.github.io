import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Server, FileText, Zap, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const WebsitePerformanceAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [cache, setCache] = useState({});

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.optimal) return 'bg-green-500 text-white';
    if (value <= thresholds.warning) return 'bg-yellow-500 text-black';
    return 'bg-red-500 text-white';
  };

  const getCachedOrFetchData = useCallback(async () => {
    const currentTime = Date.now();
    if (cache[url] && currentTime - cache[url].timestamp < 60000) {
      return cache[url].data;
    }

    // Simulating API call and analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPerformance = {
      loadTime: Math.random() * 5 + 0.5,
      serverResponse: Math.random() * 500 + 100,
      resourceCount: Math.floor(Math.random() * 100) + 10,
      uptime: Math.random() > 0.05 ? 100 : 99.9,
      performanceScore: Math.floor(Math.random() * 30) + 70
    };

    setCache(prevCache => ({
      ...prevCache,
      [url]: { data: mockPerformance, timestamp: currentTime }
    }));

    return mockPerformance;
  }, [url, cache]);

  const analyzeWebsite = async () => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const data = await getCachedOrFetchData();
      setPerformance(data);
      setHistoricalData(prevData => [...prevData, { ...data, timestamp: new Date().toISOString() }].slice(-20));
    } catch (err) {
      setError('Failed to analyze the website. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval;
    if (analyzing) {
      interval = setInterval(analyzeWebsite, 5000);
    }
    return () => clearInterval(interval);
  }, [analyzing, analyzeWebsite]);

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-100 text-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Real-Time Website Performance Analyzer</h1>
      <div className="flex space-x-2 mb-6">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="flex-grow bg-white text-gray-900 border-gray-300"
        />
        <Button onClick={analyzeWebsite} disabled={analyzing || !url} className="bg-blue-600 hover:bg-blue-700 text-white">
          {analyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100 border-red-400 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Load Time</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getStatusColor(performance.loadTime, { optimal: 1, warning: 3 })}`}>
                {performance.loadTime.toFixed(2)}s
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Response</CardTitle>
              <Server className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getStatusColor(performance.serverResponse, { optimal: 200, warning: 500 })}`}>
                {performance.serverResponse.toFixed(0)}ms
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resource Count</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getStatusColor(performance.resourceCount, { optimal: 30, warning: 60 })}`}>
                {performance.resourceCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getStatusColor(100 - performance.uptime, { optimal: 0.1, warning: 0.5 })}`}>
                {performance.uptime.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <Zap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getStatusColor(100 - performance.performanceScore, { optimal: 10, warning: 30 })}`}>
                {performance.performanceScore}/100
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Refresh</CardTitle>
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(cache[url]?.timestamp).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {historicalData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Load Time History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="timestamp" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                  <Legend />
                  <Line type="monotone" dataKey="loadTime" stroke="#8884d8" name="Load Time (s)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Server Response History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="timestamp" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                  <Legend />
                  <Area type="monotone" dataKey="serverResponse" stroke="#82ca9d" fill="#82ca9d" name="Server Response (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebsitePerformanceAnalyzer;
