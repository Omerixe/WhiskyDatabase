// src/components/WhiskyList.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhiskyItem from './WhiskyItem';
import WhiskyFilter from './WhiskyFilter';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';


const WhiskyList = () => {
    const [whiskies, setWhiskies] = useState([]);
    const [totalWhiskies, setTotalWhiskies] = useState(0);
    const [filteredTotal, setFilteredTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef(null);
    const observerRef = useRef(null);

    const updateWhiskyList = (newWhiskies, filteredTotal, totalInDb, hasMore, isInitial = false) => {
        if (isInitial) {
            // Reset list when filters change
            setWhiskies(newWhiskies);
        } else {
            // Append new whiskies for pagination
            setWhiskies(prev => [...prev, ...newWhiskies]);
        }
        setFilteredTotal(filteredTotal);
        setTotalWhiskies(totalInDb);
        setHasMore(hasMore);
        setIsLoading(false);
    };

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setIsLoading(true);
            if (loadMoreRef.current) {
                loadMoreRef.current();
            }
        }
    }, [isLoading, hasMore]);

    useEffect(() => {
        // Set up Intersection Observer for infinite scroll
        const sentinel = document.getElementById('scroll-sentinel');
        
        if (!sentinel) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(sentinel);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMore]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Übersicht
            </Typography>
            <>
                <WhiskyFilter 
                    updateWhiskyList={updateWhiskyList} 
                    loadMoreRef={loadMoreRef}
                    setIsLoading={setIsLoading}
                />
            </>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    margin: '20px auto',
                }}
            >
                <LocalBarIcon style={{ marginRight: '8px', color: '#6a4f4b' }} />
                <Typography variant="subtitle1">
                    Zeige <b>{filteredTotal}</b> von <b>{totalWhiskies ? totalWhiskies : "?"}</b> Whiskys
                </Typography>
            </Box>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {whiskies.map(whisky => (
                    <Grid item xs={12} sm={6} md={4} key={whisky.id} style={{ display: 'flex' }}>
                        <Link to={`/whisky/${whisky.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                            <WhiskyItem whisky={whisky} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
            {/* Sentinel element for infinite scroll */}
            {hasMore && (
                <Box
                    id="scroll-sentinel"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '20px',
                        minHeight: '60px'
                    }}
                >
                    {isLoading && <CircularProgress />}
                </Box>
            )}
        </div>
    );
};

export default WhiskyList;