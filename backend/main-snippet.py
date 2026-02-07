
@app.put("/api/components/{component_id}", response_model=ComponentResponse)
async def update_component(component_id: int, request: ComponentRequest):
    try:
        query = components.update().where(components.c.id == component_id).values(
            name=request.name,
            description=request.description,
            category=request.category,
            wiring_guide=request.wiring_guide,
            image_url=request.image_url
        )
        await database.execute(query)
        
        # Fetch updated record
        fetch_query = components.select().where(components.c.id == component_id)
        result = await database.fetch_one(fetch_query)
        if not result:
             raise HTTPException(status_code=404, detail="Component not found")
             
        return dict(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
