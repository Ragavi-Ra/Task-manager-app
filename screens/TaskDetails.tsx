import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute } from '@react-navigation/native';

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

type Params = {
    TaskDetails: { taskId: string };
};

const TaskDetails = ({navigation}: any) => {
    const route = useRoute<RouteProp<Params, 'TaskDetails'>>();
    const { taskId } = route.params;

    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
        const stored = await AsyncStorage.getItem('TASKS');
        const parsed: Task[] = stored ? JSON.parse(stored) : [];
        const found = parsed.find((t) => t.id === taskId);
        if (found) {
            setTask(found);
        } else {
            Alert.alert('Error', 'Task not found');
        }
    };

    const toggleStatus = async () => {
        if (!task) return;

        const updatedTask = { ...task, completed: !task.completed };
        const stored = await AsyncStorage.getItem('TASKS');
        const parsed: Task[] = stored ? JSON.parse(stored) : [];

        const updatedList = parsed.map((t) => (t.id === task.id ? updatedTask : t));
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedList));
        setTask(updatedTask);
        Alert.alert('Status Updated', `Task marked as ${updatedTask.completed ? 'Completed' : 'Pending'}`);
        navigation.goBack();
    };

    if (!task) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.status}>
                Status: {task.completed ? 'Completed' : 'Pending'}
            </Text>
            <Button
                title={`Mark as ${task.completed ? 'Pending' : 'Completed'}`}
                onPress={toggleStatus}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    status: {
        fontSize: 18,
        marginBottom: 30,
    },
});

export default TaskDetails;
