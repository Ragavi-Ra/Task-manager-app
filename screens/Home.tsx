import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';

type Task = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

const Home = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>(
                'https://jsonplaceholder.typicode.com/todos'
            );
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Task List</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }: { item: Task }) => (
                        <View style={styles.taskContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={[styles.status, item.completed ? styles.completed : styles.pending]}>
                                {item.completed ? 'Completed' : 'Pending'}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30
    },
    taskContainer: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
        marginBottom: 8,
    },
    completed: {
        backgroundColor: '#D1FAD7',
        color: '#1A7F37',
    },
    pending: {
        backgroundColor: '#FFE1D6',
        color: '#BF360C',
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
  },

})

export default Home;
