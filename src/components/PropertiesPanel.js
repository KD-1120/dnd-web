// ...existing imports...
// Utility: Recursively get the hierarchy chain of a brick by id
const getBrickHierarchy = (brickId, bricks, path = []) => {
  for (const brick of bricks) {
    const newPath = [...path, brick];
    if (brick.id === brickId) return newPath;
    if (brick.components) {
      const result = getBrickHierarchy(brickId, brick.components, newPath);
      if (result) return result;
    }
  }
  return null;
};

const getDeepBrickById = (brickId, bricks) => {
  for (const brick of bricks) {
    if (brick.id === brickId) return brick;
    if (brick.components) {
      const found = getDeepBrickById(brickId, brick.components);
      if (found) return found;
    }
  }
  return null;
};

export function PropertiesPanel() {
  const { selectedBrickId, getActiveBrick, activeTab, updateGlobalLayoutProps, updateBrickProps } = useBuilderContext();

  const selectedBrick = getActiveBrick(selectedBrickId);

  const handleUpdate = (props) => {
    if (activeTab === 'global') {
      updateGlobalLayoutProps(selectedBrick.type === 'navigation' ? 'Site Navigation' : 'Site Footer', props);
    } else {
      updateBrickProps(selectedBrickId, props);
    }
  };

  // Use the deep recursive hierarchy lookup
  const hierarchy = getBrickHierarchy(selectedBrickId, pageData);
  const selectedBrickFromHierarchy = hierarchy ? hierarchy[hierarchy.length - 1] : null;

  console.log('PropertiesPanel - Hierarchy:', hierarchy);
  console.log('PropertiesPanel - Selected brick:', selectedBrick);

  if (!selectedBrick) {
    return <div>Select a block to edit its properties</div>;
  }
  
  const brickDef = BrickRegistry[selectedBrick.type];
  if (!brickDef?.inspector) {
    return <div>No properties available for this block type</div>;
  }

  const inspectorConfig = typeof brickDef.inspector.getInspectorProps === 'function'
    ? brickDef.inspector.getInspectorProps(selectedBrick, selectedBrickId)
    : brickDef.inspector;

  console.log('PropertiesPanel - Using config:', inspectorConfig);

  return (
    <div>
      {/* Breadcrumb displaying the hierarchy */}
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#555' }}>
        {hierarchy && hierarchy.map((brick, idx) => (
          <span key={brick.id}>
            {brick.type}
            {idx < hierarchy.length - 1 ? ' / ' : ''}
          </span>
        ))}
      </div>
      {/* ...existing inspector rendering code using inspectorConfig... */}
    </div>
  );
}
