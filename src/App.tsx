import React, { useState, useEffect } from 'react';
import { Shuffle, UserPlus, RefreshCw, Users } from 'lucide-react';

function App() {
  const [names, setNames] = useState<string[]>([]);
  const [inputNames, setInputNames] = useState('');
  const [remainingNames, setRemainingNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [mode, setMode] = useState<'shuffle' | 'pick'>('shuffle');
  const [isPickAnimating, setIsPickAnimating] = useState(false);

  useEffect(() => {
    if (isPickAnimating) {
      const timer = setTimeout(() => setIsPickAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isPickAnimating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputNames(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameList = inputNames.split('\n').filter(name => name.trim() !== '');
    setNames(nameList);
    setRemainingNames(nameList);
    setSelectedNames([]);
  };

  const randomizeNames = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffled);
  };

  const pickRandomName = () => {
    if (remainingNames.length > 0) {
      setIsPickAnimating(true);
      setTimeout(() => {
        const index = Math.floor(Math.random() * remainingNames.length);
        const pickedName = remainingNames[index];
        setSelectedNames(prev => [...prev, pickedName]);
        setRemainingNames(prev => prev.filter((_, i) => i !== index));
      }, 500);
    }
  };

  const resetPicking = () => {
    setRemainingNames(names);
    setSelectedNames([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
          <Users className="mr-2" />
          Carl娃的幸运大转盘
        </h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="请输入学生名字，每行一个"
            value={inputNames}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="w-full mt-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <RefreshCw className="mr-2" size={18} />
            更新名单
          </button>
        </form>
        {names.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">随机结果：</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setMode('shuffle')}
                  className={`px-3 py-1 rounded-md transition duration-300 ${
                    mode === 'shuffle' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  一次性排序
                </button>
                <button
                  onClick={() => setMode('pick')}
                  className={`px-3 py-1 rounded-md transition duration-300 ${
                    mode === 'pick' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  逐个抽取
                </button>
              </div>
            </div>
            {mode === 'shuffle' ? (
              <div>
                <button
                  onClick={randomizeNames}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 mb-3 w-full justify-center"
                >
                  <Shuffle size={18} className="mr-2" />
                  重新排序
                </button>
                <ul className="list-none space-y-1">
                  {names.map((name, index) => (
                    <li key={index} className="text-gray-600 bg-white p-2 rounded-md shadow-sm transition duration-300 hover:shadow-md">
                      {index + 1}. {name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-3">
                  <button
                    onClick={pickRandomName}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 flex-grow mr-2"
                    disabled={remainingNames.length === 0 || isPickAnimating}
                  >
                    <UserPlus size={18} className="mr-2" />
                    {isPickAnimating ? '抽取中...' : '抽取下一个'}
                  </button>
                  <button
                    onClick={resetPicking}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                  >
                    重置
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">已抽取 ({selectedNames.length}):</h3>
                  <ul className="list-none space-y-1">
                    {selectedNames.map((name, index) => (
                      <li key={index} className="text-gray-600 bg-green-100 p-2 rounded-md shadow-sm transition duration-300 hover:shadow-md">
                        {index + 1}. {name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">未抽取 ({remainingNames.length}):</h3>
                  <ul className="list-none space-y-1">
                    {remainingNames.map((name, index) => (
                      <li key={index} className="text-gray-600 bg-white p-2 rounded-md shadow-sm transition duration-300 hover:shadow-md">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;