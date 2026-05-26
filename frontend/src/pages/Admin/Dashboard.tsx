import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import { axiosInstance } from "../../utils/axiosInstance";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";

const COLORS = ["#8D51FF","#00B8D8", "#7BCE00"]

type DashboardCharts = {
  taskDistribution?: {
    All?: number;
    Pending?: number;
    InProgress?: number;
    Completed?: number;
  };
  taskPriorityLevels?: {
    Low?: number;
    Medium?: number;
    High?: number;
  };
};

type DashboardData = {
  charts?: DashboardCharts;
  recentTasks?: unknown[];
  statistics?: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
};

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext)!;

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pieChartData, setPieChartData] = useState<{ status: string; count: number }[]>([]);
  const [, setBarChartData] = useState<{ priority: string; count: number }[]>([]);

  //Prepare Chart DData
  const prepareChartData = (data: DashboardCharts | null) => {

    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: 'Pending', count: taskDistribution?.Pending || 0 },
      { status: 'In Progress', count: taskDistribution?.InProgress || 0 },
      { status: 'Completed', count: taskDistribution?.Completed || 0 }
    ]
    setPieChartData(taskDistributionData);

    const PriorityLevelData: { priority: string, count: number }[] = [
      { priority: 'Low', count: taskPriorityLevels?.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels?.High || 0 }
    ]

    setBarChartData(PriorityLevelData);
  }


  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.TASKS.GET_USER_DASHBOARD_DATA,
          { signal: controller.signal },
        );
        if (response.data) {
          setDashboardData(response.data);
          prepareChartData(response.data?.charts || null);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching user dashboard data:", error);
      }
    };

    fetchDashboardData();

    return () => controller.abort();
  }, []);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("ddd Do MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            values={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0,
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            values={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0,
            )}
            color="bg-voilet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            values={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0,
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            values={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0,
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart 
            data={pieChartData}
            colors={COLORS}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
