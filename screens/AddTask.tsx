import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

const AddTask = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                try {
                    const stored = await AsyncStorage.getItem('TASKS');
                    const parsed: Task[] = stored ? JSON.parse(stored) : [];
                    setTasks(parsed);
                } catch (error) {
                    console.error('Failed to load tasks:', error);
                }
            };

            fetchTasks();
        }, [])
    );

    const handleAddTask = async () => {
        if (!title.trim()) {
            Alert.alert('Validation', 'Please enter a task title.');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title,
            completed: false,
        };

        try {
            const storedTasks = await AsyncStorage.getItem('TASKS');
            const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

            const updatedTasks = [...parsedTasks, newTask];
            setTasks(updatedTasks);
            await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));

            setTitle('');
        } catch (error) {
            console.error('Failed to add task:', error);
            Alert.alert('Error', 'Failed to save task.');
        }
    };

    const renderItem = ({ item }: { item: Task }) => (
        <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
        >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={[styles.status, item.completed ? styles.completed : styles.pending]}>
                {item.completed ? 'Completed' : 'Pending'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.label}>Task Title:</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter task title"
                />
                <Button title="Add Task" onPress={handleAddTask} />
            </View>
            <View style={{ marginTop: 20 }}>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 100,
        paddingBottom: 150,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
    },
    taskItem: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 8,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
        marginBottom: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    completed: {
        backgroundColor: '#D1FAD7',
        color: '#1A7F37',
    },
    pending: {
        backgroundColor: '#FFE1D6',
        color: '#BF360C',
    },
});

export default AddTask;
