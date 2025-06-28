import React, { useState } from 'react';
import { HardHatIcon, TruckIcon, ShieldIcon, LifeBuoyIcon, PlusIcon, XIcon, PackageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WMS, Equipment, EquipmentCategory, WorkStep } from '../../types';
interface EquipmentSummaryProps {
  wms: WMS;
  onUpdate: (wms: WMS) => void;
}
export const EquipmentSummary: React.FC<EquipmentSummaryProps> = ({
  wms,
  onUpdate
}) => {
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Equipment>({
    id: '',
    name: '',
    category: 'ppe',
    quantity: 1
  });
  // Get all equipment from all steps
  const allEquipment: Equipment[] = wms.steps.flatMap(step => step.equipment);
  // Group equipment by category
  const equipmentByCategory = allEquipment.reduce((acc, equipment) => {
    if (!acc[equipment.category]) {
      acc[equipment.category] = [];
    }
    // Check if equipment already exists in the category
    const existingIndex = acc[equipment.category].findIndex(e => e.name === equipment.name);
    if (existingIndex >= 0) {
      // Update quantity if it already exists
      acc[equipment.category][existingIndex].quantity += equipment.quantity;
    } else {
      // Add new equipment to the category
      acc[equipment.category].push({
        ...equipment
      });
    }
    return acc;
  }, {} as Record<EquipmentCategory, Equipment[]>);
  const handleAddEquipment = () => {
    if (!newEquipment.name) return;
    const timestamp = new Date().toISOString();
    const equipment: Equipment = {
      id: uuidv4(),
      name: newEquipment.name,
      category: newEquipment.category,
      quantity: newEquipment.quantity
    };
    // Add equipment to all steps that have the "All" flag set
    const updatedSteps = wms.steps.map(step => {
      return step;
    });
    const updatedWMS: WMS = {
      ...wms,
      steps: updatedSteps,
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    setNewEquipment({
      id: '',
      name: '',
      category: 'ppe',
      quantity: 1
    });
    setIsAddingEquipment(false);
  };
  const handleAssignToStep = (equipment: Equipment, stepId: string) => {
    const timestamp = new Date().toISOString();
    const updatedSteps = wms.steps.map(step => {
      if (step.id === stepId) {
        // Check if equipment already exists in this step
        const existingIndex = step.equipment.findIndex(e => e.name === equipment.name);
        if (existingIndex >= 0) {
          // Update quantity if it already exists
          const updatedEquipment = [...step.equipment];
          updatedEquipment[existingIndex].quantity += 1;
          return {
            ...step,
            equipment: updatedEquipment
          };
        } else {
          // Add new equipment to the step
          return {
            ...step,
            equipment: [...step.equipment, {
              ...equipment,
              id: uuidv4(),
              quantity: 1
            }]
          };
        }
      }
      return step;
    });
    const updatedWMS: WMS = {
      ...wms,
      steps: updatedSteps,
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
  };
  const getEquipmentIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'ppe':
        return <HardHatIcon size={24} />;
      case 'truck':
        return <TruckIcon size={24} />;
      case 'crane':
        return <LifeBuoyIcon size={24} />;
      case 'container':
        return <PackageIcon size={24} />;
      case 'tool':
        return <div size={24} />;
      case 'vehicle':
        return <TruckIcon size={24} />;
      default:
        return <ShieldIcon size={24} />;
    }
  };
  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'ppe':
        return 'Personal Protective Equipment';
      case 'truck':
        return 'Trucks';
      case 'crane':
        return 'Cranes';
      case 'container':
        return 'Containers';
      case 'tool':
        return 'Tools';
      case 'vehicle':
        return 'Vehicles';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Equipment Summary</h2>
        <button onClick={() => setIsAddingEquipment(true)} className="flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
          <PlusIcon size={16} className="mr-1.5" />
          Add Equipment
        </button>
      </div>
      {Object.keys(equipmentByCategory).length === 0 && !isAddingEquipment ? <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No equipment assigned yet
          </p>
          <button onClick={() => setIsAddingEquipment(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add Equipment
          </button>
        </div> : <div className="space-y-6">
          {Object.entries(equipmentByCategory).map(([category, equipment]) => <div key={category}>
              <h3 className="text-lg font-medium mb-3">
                {getCategoryTitle(category)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {equipment.map(item => <div key={item.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 mr-3">
                        {getEquipmentIcon(item.category as EquipmentCategory)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="relative">
                        <button className="text-slate-400 hover:text-blue-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Assign to step dropdown could go here */}
                  </div>)}
              </div>
            </div>)}
          {isAddingEquipment && <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-medium mb-3">Add New Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Equipment Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={newEquipment.name} onChange={e => setNewEquipment({
              ...newEquipment,
              name: e.target.value
            })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="e.g., Hard Hat" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select value={newEquipment.category} onChange={e => setNewEquipment({
              ...newEquipment,
              category: e.target.value as EquipmentCategory
            })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                    <option value="ppe">Personal Protective Equipment</option>
                    <option value="tool">Tool</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="crane">Crane</option>
                    <option value="truck">Truck</option>
                    <option value="container">Container</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input type="number" min="1" value={newEquipment.quantity} onChange={e => setNewEquipment({
            ...newEquipment,
            quantity: parseInt(e.target.value) || 1
          })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsAddingEquipment(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddEquipment} disabled={!newEquipment.name} className={`px-4 py-2 text-sm rounded-lg transition-colors ${newEquipment.name ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                  Add Equipment
                </button>
              </div>
            </div>}
        </div>}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Equipment by Step</h3>
        {wms.steps.length === 0 ? <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Add steps to assign equipment
            </p>
          </div> : <div className="space-y-4">
            {wms.steps.map((step, index) => <div key={step.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h4 className="font-medium mb-2">
                  Step {index + 1}: {step.title}
                </h4>
                {step.equipment.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    No equipment assigned to this step
                  </p> : <div className="flex flex-wrap gap-2 mb-3">
                    {step.equipment.map((equipment, i) => <div key={i} className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm">
                        {equipment.name}{' '}
                        {equipment.quantity > 1 && `(${equipment.quantity})`}
                      </div>)}
                  </div>}
              </div>)}
          </div>}
      </div>
    </div>;
};