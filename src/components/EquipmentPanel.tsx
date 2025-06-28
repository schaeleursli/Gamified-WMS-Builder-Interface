import React, { useState } from 'react';
import { HardHatIcon, TruckIcon, HammerIcon, ShieldIcon, LifeBuoyIcon, CheckCircleIcon, PlusIcon, XIcon } from 'lucide-react';
interface EquipmentPanelProps {
  onComplete: () => void;
  xpPoints: number;
  setXpPoints: (points: number) => void;
}
interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  icon: React.ReactNode;
}
export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({
  onComplete,
  xpPoints,
  setXpPoints
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const equipmentOptions: Equipment[] = [{
    id: 'e1',
    name: 'Hard Hat',
    category: 'PPE',
    quantity: 1,
    icon: <HardHatIcon size={24} />
  }, {
    id: 'e2',
    name: 'Safety Boots',
    category: 'PPE',
    quantity: 1,
    icon: <ShieldIcon size={24} />
  }, {
    id: 'e3',
    name: 'Safety Harness',
    category: 'PPE',
    quantity: 1,
    icon: <LifeBuoyIcon size={24} />
  }, {
    id: 'e4',
    name: 'Hammer',
    category: 'Tool',
    quantity: 1,
    icon: <HammerIcon size={24} />
  }, {
    id: 'e5',
    name: 'Forklift',
    category: 'Vehicle',
    quantity: 1,
    icon: <TruckIcon size={24} />
  }];
  const handleAddEquipment = (equipment: Equipment) => {
    if (!selectedEquipment.some(e => e.id === equipment.id)) {
      setSelectedEquipment([...selectedEquipment, equipment]);
      setXpPoints(prev => prev + 10);
    }
  };
  const handleRemoveEquipment = (id: string) => {
    setSelectedEquipment(selectedEquipment.filter(e => e.id !== id));
  };
  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedEquipment(selectedEquipment.map(e => e.id === id ? {
      ...e,
      quantity
    } : e));
  };
  const handleComplete = () => {
    if (selectedEquipment.length > 0) {
      setXpPoints(prev => prev + 25);
      onComplete();
    }
  };
  return <div>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <HardHatIcon size={24} />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">Equipment Assignment</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Select equipment needed for this work
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipment Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Available Equipment</h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 h-[300px] overflow-y-auto">
            <div className="space-y-3">
              {equipmentOptions.map(equipment => <div key={equipment.id} className={`p-3 rounded-lg border transition-all cursor-pointer
                    ${selectedEquipment.some(e => e.id === equipment.id) ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`} onClick={() => handleAddEquipment(equipment)}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {equipment.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">{equipment.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {equipment.category}
                      </div>
                    </div>
                    <div>
                      {selectedEquipment.some(e => e.id === equipment.id) ? <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <CheckCircleIcon size={16} />
                        </div> : <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <PlusIcon size={16} />
                        </div>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        {/* Selected Equipment */}
        <div>
          <h3 className="text-lg font-medium mb-4">Selected Equipment</h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 h-[300px] overflow-y-auto">
            {selectedEquipment.length === 0 ? <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                <p>No equipment selected yet</p>
              </div> : <div className="space-y-3">
                {selectedEquipment.map(equipment => <div key={equipment.id} className="p-3 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {equipment.icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="font-medium">{equipment.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {equipment.category}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-3">
                          <button onClick={() => equipment.quantity > 1 && handleQuantityChange(equipment.id, equipment.quantity - 1)} className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            -
                          </button>
                          <span className="mx-2 text-sm">
                            {equipment.quantity}
                          </span>
                          <button onClick={() => handleQuantityChange(equipment.id, equipment.quantity + 1)} className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            +
                          </button>
                        </div>
                        <button onClick={() => handleRemoveEquipment(equipment.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {selectedEquipment.length === 0 ? 'Click on equipment to add it to your WMS' : `${selectedEquipment.length} equipment item${selectedEquipment.length !== 1 ? 's' : ''} selected`}
            </p>
            <button onClick={handleComplete} disabled={selectedEquipment.length === 0} className={`px-6 py-2 rounded-lg font-medium transition-all
                ${selectedEquipment.length > 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>;
};